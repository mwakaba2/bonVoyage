#!/usr/bin/env bash
./data_import_heroku.sh
python geocode_import_heroku.py
python attractions_import_heroku.py
python attractions_raw_import_heroku.py