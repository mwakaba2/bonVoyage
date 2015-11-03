from pymongo import MongoClient
import json


def the_import(_config, _filename, _field_name):
    _client = MongoClient(_config["uri"])
    _database = _client[_config["db_name"]]
    if not (_config["username"] is "" and _config["password"] is ""):
        _database.authenticate(_config["username"], _config["password"])
    _collection = _database[_config["collection"]]
    _cities = []
    for _city in _collection.find():
        _cities.append(_city)

    # Read file
    with open(_filename) as __file:
        _data = json.load(__file)

    # Import
    for _data_item in _data:
        __name = _data_item["name"]
        _collection.update_one(
            {"name": __name},
            {
                "$set": {_field_name: _data_item["data"]}
            }
        )
