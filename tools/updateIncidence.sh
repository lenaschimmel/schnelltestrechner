#!/bin/bash
set -e 
BASEDIR=$(dirname "$0")
cd $BASEDIR

if [ -z "$TARGET" ]; then 
    LOCALTARGET="../site/public"
    echo "Updated incidence in source dir Set TARGET to the root of the website to update there.";
else
    LOCALTARGET=$TARGET
fi

curl -f https://api.corona-zahlen.org/germany/history/incidence/9 -o   $LOCALTARGET/data/germany.json
curl -f https://api.corona-zahlen.org/states/history/incidence/9 -o    $LOCALTARGET/data/states.json
curl -f https://api.corona-zahlen.org/districts/history/incidence/9 -o $LOCALTARGET/data/districts.json
curl -f https://api.corona-zahlen.org/districts -o                     $LOCALTARGET/data/districts_full.json
echo "Updated incidence in $LOCALTARGET/data/*.json"