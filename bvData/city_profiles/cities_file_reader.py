import json
from collections import namedtuple

Result = namedtuple('Result', ['names', 'countries'])


def read_cities_file():
    with open('cities.json') as cities_file:
        data = json.load(cities_file)
        names = map(lambda item: item.get("name").replace(" ", "_"), data)
        countries = map(lambda item: item.get("country").replace(" ", "_"), data)
    return Result(names=names, countries=countries)
