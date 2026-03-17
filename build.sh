#!/bin/bash
# Build script for PuskesBot frontend
# Builds both versions: IP (/puskesbot/) and Domain (/)

set -e

cd /var/www/puskesbot/frontend

echo "🔨 Building for IP access (base=/puskesbot/)..."
npm run build
echo "✅ dist/ ready (IP version)"

echo ""
echo "🔨 Building for domain access (base=/)..."
VITE_BASE_PATH=/ npx vite build --outDir dist-domain
echo "✅ dist-domain/ ready (domain version)"

echo ""
echo "🔄 Restarting frontend..."
pm2 restart puskesbot-frontend

echo ""
echo "✅ Done! Both versions deployed."
echo "   IP:     http://103.162.115.123/puskesbot/"
echo "   Domain: http://woricare.online/"
