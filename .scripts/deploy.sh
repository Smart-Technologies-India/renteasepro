#!/bin/bash
set -e

echo "Deployment started..."

# Pull the latest version of the app
git pull origin master
echo "New changes copied to server !"

echo "Installing Dependencies..."
pnpm install

echo "Updating database..."
pnpm exec prisma db push

echo "Creating Production Build..."
pnpm build

echo "PM2 Reload"
pm2 reload rentpro

echo "Deployment Finished!"