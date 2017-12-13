#!/bin/bash
set -e

echo | composer install
npm install
npm install -g webpack

php bin/console doctrine:schema:create
webpack

exec "$@"
