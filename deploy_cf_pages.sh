#!/bin/bash
set -e

# Deploy to Cloudflare Pages
# Usage: ./deploy_cf_pages.sh <project-name>

PROJECT_NAME=${1:-realtech-tools}

echo "🚀 Deploying $PROJECT_NAME to Cloudflare Pages..."

# Build
echo "📦 Building..."
npm run build

# Deploy
echo "📤 Deploying..."
wrangler pages deploy ./dist --project-name=$PROJECT_NAME

echo ""
echo "✅ Deploy complete!"
echo "🌐 URL: https://$PROJECT_NAME.pages.dev"
