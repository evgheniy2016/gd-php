#!/bin/bash

set -x

while [[ `wget -S --spider "localhost:8000/installed.txt"  2>&1 | grep 'HTTP/1.1 200 OK'` ]]; do
  >&2 echo "File not exist - sleeping"
  sleep 1
done
