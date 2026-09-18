#!/usr/bin/env bash
# Manual server-side deploy script — mirrors the "🚀 Deploy over SSH" step
# in .github/workflows/deploy.yml, so it must be kept in sync with that file.
#
# Usage (run directly ON THE SERVER, as the deploy user):
#   GITHUB_BRANCH=master bash /home/projects/edulink/deploy.sh
# or over SSH from your machine:
#   ssh user@server 'GITHUB_BRANCH=master bash /home/projects/edulink/deploy.sh'
#
# Requires /home/projects/edulink to already be a git clone of this repo,
# with .env.production and ecosystem.config.js present in that folder.
set -e

GITHUB_BRANCH="${GITHUB_BRANCH:-master}"

echo "Deploying branch: $GITHUB_BRANCH"

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "Go to project folder"
cd /home/projects/edulink

echo "Check .env.production"
if [ ! -f .env.production ]; then
  echo ".env.production not found on server"
  exit 1
fi

echo "Fetch latest code"
git fetch origin "$GITHUB_BRANCH"

echo "Clean untracked files but keep .env.production"
git clean -fd -e .env.production

echo "Reset to latest $GITHUB_BRANCH"
git reset --hard "origin/$GITHUB_BRANCH"

echo "Install dependencies"
npm ci

echo "Build Next.js app"
npm run build

echo "Reload PM2"
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js --update-env

echo "Save PM2 state"
pm2 save

echo "Deploy completed successfully"
