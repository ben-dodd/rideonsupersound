#!/bin/bash
cd /home/ubuntu/rideonsupersound
git pull origin ross2.0
npm install --legacy-peer-deps &&
npm run build &&
pm2 restart rideonsupersound