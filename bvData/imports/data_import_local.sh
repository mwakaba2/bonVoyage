#!/usr/bin/env bash
mongoimport -h localhost -d bonVoyage -c cities --file data.json --jsonArray
