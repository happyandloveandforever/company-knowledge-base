#!/usr/bin/env bash
# 知识库 Web 服务守护进程：崩溃自动重启，Cloud Agent 会话内持续可用
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-43123}"
HOST="${HOST:-0.0.0.0}"
PID_FILE="/tmp/knowledge-base-server.pid"
LOG_FILE="/tmp/knowledge-base-server.log"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

if [ ! -d ".next" ]; then
  log "首次启动，正在构建…"
  npm run build >> "$LOG_FILE" 2>&1
fi

log "知识库服务启动 → http://${HOST}:${PORT}"
echo $$ > "$PID_FILE"

while true; do
  log "next start -p $PORT -H $HOST"
  npm run start -- -p "$PORT" -H "$HOST" >> "$LOG_FILE" 2>&1 || true
  log "服务退出，2 秒后自动重启…"
  sleep 2
done
