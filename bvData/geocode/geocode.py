import cities_file_reader
import geocoder
import json
import time

# Input: cities.json file
# Input format:
# [{name: "name of the city", country: "country of that city"}, ...]

# Output: corresponding geocode.json file
# Output format:
# [
#   {
#       "name": "name of the city",
#       "data": [four coordinates of the bounding box]
#   }
# ]

# Read in cities.json
result = cities_file_reader.read_cities_file()
names = result.names
countries = result.countries


# Currencies
def geocode(_name, _country):
    print "Getting geocode for " + _name + ", " + _country

    _geocode = []
    try:
        # sleep to avoid OVER QUERY LIMIT
        time.sleep(1)
        g = geocoder.google(_name + ", " + _country)
        bbox = g.bbox
        _geocode = bbox['northeast'] + bbox['southwest']
        print(_geocode)
    except AttributeError:
        print "Latlng not found for " + _name + ", " + _country
    except IndexError:
        print "Latlng not found for " + _name + ", " + _country
    except KeyError:
        print "Latlng not found for " + _name + ", " + _country
    return {
        "name": _name.replace("_", " "),
        "data": _geocode
    }


geocodes = map(geocode, names, countries)
with open('geocode.json', 'w') as geocodes_file:
    json.dump(geocodes, geocodes_file)
