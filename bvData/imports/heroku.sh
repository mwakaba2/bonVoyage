#!/usr/bin/env bash
sh data_import_heroku.sh
python geocode_import_heroku.py
python attractions_import_heroku.py
python attractions_bubble_import_heroku.py
python attraction_links_import_heroku.py