#!/bin/bash
set -e 
BASEDIR=$(dirname "$0")
cd $BASEDIR

curl https://api.corona-zahlen.org/germany/history/incidence/8 -o ../site/data/germany.json
curl https://api.corona-zahlen.org/states/history/incidence/8 -o ../site/data/states.json
curl https://api.corona-zahlen.org/districts/history/incidence/8 -o ../site/data/districts.json
curl https://api.corona-zahlen.org/districts -o ../site/data/districts_full.json