#!/bin/sh -e
npm run build
find /mnt/www/nginx -type f -delete
cp -rp ./dist/* /mnt/www/nginx
date
