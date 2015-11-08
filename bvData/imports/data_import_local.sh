#!/usr/bin/env bash
mongoimport -h localhost -d bonVoyage -c cities --drop --file data.json --jsonArray
