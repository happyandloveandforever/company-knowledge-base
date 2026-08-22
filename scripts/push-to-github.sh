#!/usr/bin/env bash
# 一键推送到 GitHub（用户只需先点一次 Connect GitHub）
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_NAME="${1:-company-knowledge-base}"

if ! gh auth status &>/dev/null; then
  echo ""
  echo "GitHub not connected."
  echo "Click Connect GitHub (bottom left in Cursor), authorize in browser,"
  echo "then say in chat: GitHub connected, please push"
  echo ""
  exit 1
fi

USER=$(gh api user -q .login)
REMOTE="https://github.com/${USER}/${REPO_NAME}.git"

echo "GitHub user: $USER"
echo "Target repo: $REPO_NAME"

if ! gh repo view "$USER/$REPO_NAME" &>/dev/null; then
  echo "Creating private repo and pushing..."
  gh repo create "$REPO_NAME" --private --source=. --remote=github --push
else
  echo "Repo exists, pushing..."
  git remote remove github 2>/dev/null || true
  git remote add github "$REMOTE"
  git push -u github main
fi

echo ""
echo "DONE. Clone this in New Chat:"
echo "https://github.com/${USER}/${REPO_NAME}.git"
echo ""
