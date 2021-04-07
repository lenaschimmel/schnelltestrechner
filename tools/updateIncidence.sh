#!/bin/bash
set -e 
BASEDIR=$(dirname "$0")
cd $BASEDIR

if [ -z "$TARGET" ]; then 
    echo "Updated incidence in source dir Set TARGET to the root of the website to update there.";
    curl https://api.corona-zahlen.org/germany/history/incidence/8 -o   ../site/public/data/germany.json
    curl https://api.corona-zahlen.org/states/history/incidence/8 -o    ../site/public/data/states.json
    curl https://api.corona-zahlen.org/districts/history/incidence/8 -o ../site/public/data/districts.json
    curl https://api.corona-zahlen.org/districts -o                     ../site/public/data/districts_full.json 
else 
    echo "Updated incidence in $TARGET/data/*.json"
    curl https://api.corona-zahlen.org/germany/history/incidence/8 -o   $TARGET/data/germany.json
    curl https://api.corona-zahlen.org/states/history/incidence/8 -o    $TARGET/data/states.json
    curl https://api.corona-zahlen.org/districts/history/incidence/8 -o $TARGET/data/districts.json
    curl https://api.corona-zahlen.org/districts -o                     $TARGET/data/districts_full.json
fi