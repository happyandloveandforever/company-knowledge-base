#!/usr/bin/env bash
# 知识库 Web 服务守护进程：崩溃自动重启，Cloud Agent 会话内持续可用
#
# 单实例保证：environment.json 的 start 和 terminals 会同时拉起本脚本，
# 第二个实例拿不到 flock，就转为跟随日志，不再抢占端口。
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-43123}"
HOST="${HOST:-0.0.0.0}"
PID_FILE="${PID_FILE:-/tmp/knowledge-base-server.pid}"
LOG_FILE="${LOG_FILE:-/tmp/knowledge-base-server.log}"
LOCK_FILE="${LOCK_FILE:-/tmp/knowledge-base-server.lock}"
HEALTH_URL="http://127.0.0.1:${PORT}/api/health"
MAX_LOG_BYTES="${MAX_LOG_BYTES:-5242880}"   # 5 MB 后轮转，避免无限增长
FOREIGN_POLL_SEC="${FOREIGN_POLL_SEC:-15}"
BACKOFF_MAX_SEC="${BACKOFF_MAX_SEC:-60}"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

health_ok() { curl -sf -m 5 "$HEALTH_URL" >/dev/null 2>&1; }

rotate_log() {
  if [ -f "$LOG_FILE" ]; then
    local size
    size=$(wc -c <"$LOG_FILE" 2>/dev/null || echo 0)
    if [ "$size" -gt "$MAX_LOG_BYTES" ]; then
      mv -f "$LOG_FILE" "${LOG_FILE}.1"
    fi
  fi
}

# 只允许一个守护进程持有端口；后到者跟随日志而不是反复重启抢端口
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "[$(date '+%H:%M:%S')] 守护进程已在运行，改为跟随日志（Ctrl+C 退出不影响服务）"
  exec tail -n 40 -f "$LOG_FILE"
fi

if [ ! -d ".next" ]; then
  log "首次启动，正在构建…"
  npm run build >>"$LOG_FILE" 2>&1
fi

log "知识库服务守护进程启动 → http://${HOST}:${PORT}"
echo $$ >"$PID_FILE"

CHILD_PID=""
cleanup() {
  log "收到退出信号，清理…"
  [ -n "$CHILD_PID" ] && kill "$CHILD_PID" 2>/dev/null || true
  rm -f "$PID_FILE"
  exit 0
}
trap cleanup SIGTERM SIGINT

backoff=2
foreign_reported=0

while true; do
  # 端口被别的进程占着且服务是健康的：让出去，只做监控，绝不空转重启
  if health_ok; then
    if [ "$foreign_reported" -eq 0 ]; then
      log "检测到 ${PORT} 端口已有健康服务，转为监控模式（每 ${FOREIGN_POLL_SEC}s 检查）"
      foreign_reported=1
    fi
    sleep "$FOREIGN_POLL_SEC"
    continue
  fi
  foreign_reported=0

  rotate_log
  log "next start -p $PORT -H $HOST"
  started_at=$(date +%s)
  npm run start -- -p "$PORT" -H "$HOST" >>"$LOG_FILE" 2>&1 &
  CHILD_PID=$!
  wait "$CHILD_PID" || true
  CHILD_PID=""
  ran_for=$(( $(date +%s) - started_at ))

  if [ "$ran_for" -ge 30 ]; then
    backoff=2   # 跑够久算正常服役，重启退避归零
  else
    backoff=$(( backoff * 2 ))
    [ "$backoff" -gt "$BACKOFF_MAX_SEC" ] && backoff="$BACKOFF_MAX_SEC"
  fi

  log "服务退出（运行 ${ran_for}s），${backoff} 秒后自动重启…"
  sleep "$backoff"
done
