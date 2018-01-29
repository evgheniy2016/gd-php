#!/bin/bash
set -e

cmd="$@"

until mysql -h "${DB_HOST}" -u ${DB_USER} -p${DB_PASSWORD} ${DB_DATABASE} -e 'select 1'; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done

composer install
npm install

php bin/console doctrine:schema:create
./node_modules/.bin/webpack

rm ./web/installing.txt

exec $cmd
