#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
cd /home/ubuntu/rideonsupersound
git pull origin ross2.0
npm install --legacy-peer-deps &&
npm run build &&
pm2 restart rideonsupersound