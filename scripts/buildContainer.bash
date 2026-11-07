#!/bin/bash

owd=$(pwd)
scriptdir=`dirname "$BASH_SOURCE"`

cd "$scriptdir"

cd ..
rm -rf build
env-cmd -e $1 -- react-scripts build

mv dist scripts
cd "$scriptdir"

docker build --platform linux/amd64 --provenance false -t $2 .
docker push --platform linux/amd64 $2

rm -rf build

cd "$owd"
