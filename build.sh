#!/bin/sh -e
rm -rf dist
rm -rf dist
npm run build
find /mnt/www/nginx -type f -delete
cp -rp ./dist/* /mnt/www/nginx
date
