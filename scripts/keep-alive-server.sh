#!/usr/bin/env bash
# 知识库 Web 服务守护进程：崩溃自动重启，Cloud Agent 会话内持续可用
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-43123}"
HOST="${HOST:-0.0.0.0}"
PID_FILE="/tmp/knowledge-base-server.pid"
LOG_FILE="/tmp/knowledge-base-server.log"
HEALTH_URL="http://127.0.0.1:${PORT}/api/health"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# 避免重复启动多个守护进程
if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE" 2>/dev/null || true)
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    if curl -sf "$HEALTH_URL" >/dev/null 2>&1; then
      log "服务已在运行 (PID $OLD_PID)，跳过重复启动"
      exit 0
    fi
    log "旧进程 $OLD_PID 无响应，重新启动…"
    kill "$OLD_PID" 2>/dev/null || true
    sleep 1
  fi
fi

if [ ! -d ".next" ]; then
  log "首次启动，正在构建…"
  npm run build >> "$LOG_FILE" 2>&1
fi

log "知识库服务启动 → http://${HOST}:${PORT}"
echo $$ > "$PID_FILE"

cleanup() {
  log "收到退出信号，清理…"
  rm -f "$PID_FILE"
  exit 0
}
trap cleanup SIGTERM SIGINT

while true; do
  log "next start -p $PORT -H $HOST"
  npm run start -- -p "$PORT" -H "$HOST" >> "$LOG_FILE" 2>&1 || true
  log "服务退出，2 秒后自动重启…"
  sleep 2
done
