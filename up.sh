#!/bin/bash
set -e 
BASEDIR=$(dirname "$0")
cd $BASEDIR
npm i

git pull

cd tools
npm i
./updateList.sh
./updateIncidence.sh

cd ../site
npm i
npm run build
if [ -z "$TARGET" ]; then 
    echo "Did not deploy. Set TARGET var to deploy."; 
else 
    cp -rf dist/* $TARGET/; 
    echo "Deployed web page to $TARGET"
fi

