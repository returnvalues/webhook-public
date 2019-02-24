#!/bin/bash

# DIRECTORY TO THE REPOSITORY
REPOSITORY="/var/www/virtualhosts/<site-name>"
echo $1 >> logs/<site-name>-$1.txt

cd $REPOSITORY
VER=$1 npm run www:webhook
# git fetch origin refs/tags/$1:refs/tags/$1
# git checkout $1