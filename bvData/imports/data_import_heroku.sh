#!/usr/bin/env bash
mongoimport -h ds033018.mongolab.com:33018 -d heroku_358800q5 -c cities -u bv -p bonvoyage2015 --drop --file data.json --jsonArray
