#!/bin/bash
set -e 
BASEDIR=$(dirname "$0")
cd $BASEDIR

# update from repo
git pull

# install global (dev) stuff
npm i

# install dependencies of tools and run them
cd tools
npm i
./updateList.sh
./updateIncidence.sh

# install runtime dependencies
cd ../site
npm i
# copy Mathjax runtime as documented at http://docs.mathjax.org/en/latest/web/hosting.html
cp -r node_modules/mathjax/es5/* public/mathjax/
npm run build
if [ -z "$TARGET" ]; then 
    echo "Did not deploy. Set TARGET var to deploy."; 
else 
    cp -rf dist/* $TARGET/; 
    echo "Deployed web page to $TARGET"
fi

