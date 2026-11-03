#!/bin/sh
set -eu

cd /app
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
exec node dist/apps/auth-pod/main.js
