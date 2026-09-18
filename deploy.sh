#!/usr/bin/env bash
# Manual server-side deploy script — mirrors the "🚀 Deploy on server" step
# in .github/workflows/deploy.yml, so it must be kept in sync with that file.
#
# Usage (run ON THE SERVER, as the deploy user):
#   1. Build locally/in CI and produce deploy.tar.gz containing:
#        .next  public  package.json  package-lock.json  next.config.ts  .env.production
#   2. Upload it to the server:
#        scp deploy.tar.gz user@server:/tmp/
#   3. SSH in and run this script:
#        ssh user@server 'bash /home/projects/edulink/deploy.sh'
#      (or run it locally on the server once it's already there)
set -e

echo "🚀 Deploying edulink (npm)..."

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

PROJECT_DIR="/home/projects/edulink"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Backup (keep last 3)
if [ -d ".next" ]; then
  echo "📋 Creating backup..."
  tar -czf "../edulink-backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
    .next public package.json .env.production node_modules 2>/dev/null || true

  cd ..
  ls -t edulink-backup-*.tar.gz 2>/dev/null | tail -n +4 | xargs rm -f || true
  cd "$PROJECT_DIR"
fi

# Extract
echo "📂 Extracting files..."
tar -xzf /tmp/deploy.tar.gz
rm -f /tmp/deploy.tar.gz

# Install production deps only
echo "📦 Installing production dependencies..."
npm ci --omit=dev

# PM2 restart (next start -p 3007; backend owns 3003)
echo "🔄 Restarting PM2..."
pm2 delete edulink 2>/dev/null || true
pm2 start npm --name edulink -- run start -- -p 3007
pm2 save

echo "✅ Deployment finished"
pm2 list
