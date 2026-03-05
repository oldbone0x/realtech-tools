#!/bin/bash

# Monitor Cloudflare Pages deployment status
# Usage: ./monitor-deploy.sh

PROJECT_NAME="realtech-tools"
DEPLOY_URL="https://${PROJECT_NAME}.pages.dev"
CHECK_INTERVAL=10
MAX_CHECKS=30

echo "🔍 Monitoring Cloudflare Pages deployment for ${PROJECT_NAME}..."
echo "🌐 URL: ${DEPLOY_URL}"
echo ""

check_count=0
last_hash=""

while [ $check_count -lt $MAX_CHECKS ]; do
    check_count=$((check_count + 1))
    timestamp=$(date +"%H:%M:%S")
    
    # Check if site is accessible
    response=$(curl -s -o /dev/null -w "%{http_code}" "${DEPLOY_URL}" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        # Get page title to detect changes
        current_hash=$(curl -s "${DEPLOY_URL}" 2>/dev/null | grep -o 'main-[^"]*\.js' | head -1)
        
        if [ "$current_hash" != "$last_hash" ] && [ -n "$current_hash" ]; then
            echo "✅ [${timestamp}] Deployment detected! New build: ${current_hash}"
            last_hash=$current_hash
            
            # Verify site is fully loaded
            css_hash=$(curl -s "${DEPLOY_URL}" 2>/dev/null | grep -o 'main-[^"]*\.css' | head -1)
            
            if [ -n "$css_hash" ]; then
                echo "✨ [${timestamp}] Site fully deployed!"
                echo "   JS: ${current_hash}"
                echo "   CSS: ${css_hash}"
                echo ""
                echo "🎉 Deployment complete!"
                echo "🌐 Live URL: ${DEPLOY_URL}"
                exit 0
            fi
        else
            echo "⏳ [${timestamp}] Site is live (build: ${current_hash:-checking...})"
        fi
    elif [ "$response" = "404" ]; then
        echo "⏳ [${timestamp}] Waiting for deployment... (${check_count}/${MAX_CHECKS})"
    else
        echo "⚠️  [${timestamp}] Status: ${response:-unknown}"
    fi
    
    sleep $CHECK_INTERVAL
done

echo ""
echo "⏰ Timeout after ${MAX_CHECKS} checks"
echo "🌐 Check manually: ${DEPLOY_URL}"
exit 1
