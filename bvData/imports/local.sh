#!/usr/bin/env bash
./data_import_local.sh
python geocode_import_local.py
python attractions_import_local.py