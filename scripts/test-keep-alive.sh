#!/usr/bin/env bash
# 回归测试：environment.json 会同时从 start 和 terminals 拉起守护进程，
# 旧版本两个实例都进入启动循环，落败的那个每 2 秒 EADDRINUSE 空转刷日志。
# 本测试在独立端口上拉起两个实例，断言只有一个真正持有端口、且没有 EADDRINUSE 空转。
set -uo pipefail
cd "$(dirname "$0")/.."

export PORT="${TEST_PORT:-43877}"
TMP=$(mktemp -d)
export PID_FILE="$TMP/server.pid"
export LOG_FILE="$TMP/server.log"
export LOCK_FILE="$TMP/server.lock"

PIDS=()
cleanup() {
  for p in "${PIDS[@]:-}"; do
    [ -n "$p" ] && kill -- "-$p" 2>/dev/null
  done
  sleep 1
  rm -rf "$TMP"
}
trap cleanup EXIT

fail() { echo "FAIL: $*"; exit 1; }
pass() { echo "PASS: $*"; }

# ss 不一定装了，netstat 兜底
listener_pids() {
  if command -v ss >/dev/null 2>&1; then
    ss -lntpH "sport = :$PORT" 2>/dev/null | grep -o 'pid=[0-9]*' | cut -d= -f2
  else
    netstat -lptn 2>/dev/null \
      | awk -v p=":$PORT\$" '$1 ~ /^tcp/ && $4 ~ p {print $7}' \
      | cut -d/ -f1 | grep -E '^[0-9]+$'
  fi
}

echo "=== 同时拉起两个守护进程（端口 $PORT）==="
setsid bash scripts/keep-alive-server.sh >"$TMP/a.out" 2>&1 &
PIDS+=($!)
setsid bash scripts/keep-alive-server.sh >"$TMP/b.out" 2>&1 &
PIDS+=($!)

echo "等待服务就绪…"
ready=0
for _ in $(seq 1 60); do
  if curl -sf -m 3 "http://127.0.0.1:$PORT/api/health" >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
[ "$ready" -eq 1 ] || { cat "$TMP/server.log"; fail "服务未在 60s 内就绪"; }
pass "服务健康：$(curl -s -m 3 "http://127.0.0.1:$PORT/api/health")"

echo "观察 20s，检查是否有空转重启…"
sleep 20

listeners=$(listener_pids | sort -u | wc -l)
[ "$listeners" -eq 1 ] || fail "期望 1 个监听者，实际 $listeners"
pass "端口 $PORT 只有 1 个监听者"

addrinuse=$(grep -c EADDRINUSE "$TMP/server.log" "$TMP/a.out" "$TMP/b.out" 2>/dev/null | awk -F: '{s+=$2} END{print s+0}')
[ "$addrinuse" -eq 0 ] || { grep -n EADDRINUSE "$TMP/server.log" | head; fail "出现 $addrinuse 次 EADDRINUSE 空转"; }
pass "无 EADDRINUSE 空转"

starts=$(grep -c "\] next start -p" "$TMP/server.log" 2>/dev/null || echo 0)
[ "$starts" -eq 1 ] || { cat "$TMP/server.log"; fail "期望只启动 1 次 next start，实际 $starts 次"; }
pass "只启动了 1 次 next start（无重启风暴）"

grep -q "守护进程已在运行，改为跟随日志" "$TMP/a.out" "$TMP/b.out" \
  || fail "第二个实例没有转为跟随日志模式"
pass "第二个实例转为跟随日志，未抢占端口"

echo "=== 崩溃自动重启 ==="
child=$(listener_pids | head -1)
[ -n "$child" ] || fail "找不到监听进程 PID"
echo "杀掉服务进程 $child …"
kill "$child" 2>/dev/null

recovered=0
for _ in $(seq 1 60); do
  if curl -sf -m 3 "http://127.0.0.1:$PORT/api/health" >/dev/null 2>&1; then recovered=1; break; fi
  sleep 1
done
[ "$recovered" -eq 1 ] || { tail -30 "$TMP/server.log"; fail "崩溃后未自动恢复"; }
pass "崩溃后自动重启成功"

echo
echo "全部通过 ✅"
