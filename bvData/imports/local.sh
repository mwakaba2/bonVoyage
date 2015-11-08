#!/usr/bin/env bash
sh data_import_local.sh
python geocode_import_local.py
python attractions_import_local.py
python attractions_bubble_import_local.py
python attraction_links_import_local.py