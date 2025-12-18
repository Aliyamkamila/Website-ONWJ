#!/bin/bash

# ============================================
# ONWJ Production Deployment Script
# ============================================

set -e  # Exit on error

echo "🚀 Starting ONWJ Production Deployment..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production file not found${NC}"
    exit 1
fi

# Backup current .env if exists
if [ -f .env ]; then
    echo -e "${YELLOW}📦 Backing up current .env to .env.backup...${NC}"
    cp .env .env.backup
fi

# Copy production environment
echo -e "${GREEN}📝 Activating production environment...${NC}"
cp .env.production .env

# Put application in maintenance mode
echo -e "${YELLOW}🔧 Entering maintenance mode...${NC}"
php artisan down --retry=60 --secret="onwj-maintenance-bypass"

# Pull latest code (if using git)
if [ -d .git ]; then
    echo -e "${GREEN}📥 Pulling latest code...${NC}"
    git pull origin main
fi

# Install/Update dependencies
echo -e "${GREEN}📦 Installing Composer dependencies...${NC}"
composer install --no-dev --optimize-autoloader

# Clear all caches
echo -e "${YELLOW}🧹 Clearing all caches...${NC}"
php artisan config:clear
php artisan route: clear
php artisan view:clear
php artisan cache:clear

# Run migrations (with backup prompt)
echo -e "${YELLOW}🗄️  Database migrations...${NC}"
read -p "Run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    php artisan migrate --force
fi

# Run production optimizations
echo -e "${GREEN}⚡ Running production optimizations...${NC}"
php artisan optimize:production

# Set correct permissions
echo -e "${GREEN}🔐 Setting correct permissions...${NC}"
chmod -R 755 storage bootstrap/cache
chown -R www-data: www-data storage bootstrap/cache

# Restart queue workers (if using supervisor)
if command -v supervisorctl &> /dev/null; then
    echo -e "${GREEN}♻️  Restarting queue workers...${NC}"
    sudo supervisorctl restart all
fi

# Restart PHP-FPM (adjust service name based on your setup)
if command -v systemctl &> /dev/null; then
    echo -e "${GREEN}♻️  Restarting PHP-FPM...${NC}"
    sudo systemctl restart php8.2-fpm
fi

# Exit maintenance mode
echo -e "${GREEN}✅ Exiting maintenance mode...${NC}"
php artisan up

# Check optimization status
echo ""
echo -e "${GREEN}📊 Optimization Status: ${NC}"
php artisan optimize:production --check

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}Maintenance bypass URL: https://yourdomain.com/onwj-maintenance-bypass${NC}"
echo ""