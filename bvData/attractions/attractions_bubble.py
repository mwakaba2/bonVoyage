import json
import math
import random
import time
from googleplaces import GooglePlaces, types, lang
API_KEY = 'AIzaSyAF_pJjojJ5kELi7q_W_Kgd6xhfJ7EQ1i0'
google_places = GooglePlaces(API_KEY)

# Input: attraction_overall.json file
# Input format:
# [
#   {sight-seeing: 12, museums: 10, ...},
#   {museums: 7, ...},
#   ...
# ]

# Output: corresponding attractions_bubble.json file
# For each category rescale the values from 20 tp 150 
# to display a human readable bubble chart

with open('../imports/attractions_raw.json') as _input_file:
    raw_data = json.load(_input_file)

with open('cities.json') as _cities_file:
    city_data = json.load(_cities_file)

with open('../imports/geocode.json') as _geocode_file:
    geo_data = json.load(_geocode_file)


cities = map(lambda i: i["name"], raw_data)
countries = map(lambda i: i["country"], city_data)
geocodes = map(lambda i: i["data"], geo_data)
raw_data = map(lambda i: i["data"], raw_data)

# Gather all categories
all_categories = set()
for _city in raw_data:
    for __category in _city:
        all_categories.add(__category)

# Patch raw data so that every city has all categories
for _city in raw_data:
    for __category in all_categories:
        if __category not in _city:
            _city[__category] = 0


# Input
#   list: ordered list of tuples, tuple[0] = key, tuple[1] = number
# Output
#   Each tuple has a dictionary of "value" normalized according to 20 - 150 indices
#   and geocode of the most prominent location of that category 
def even_distribution(_list):
    origMax = max(_list, key=lambda item: item[1])[1]
    origMin = min(_list, key=lambda item: item[1])[1]
    newMax = 150
    newMin = 20

    # Figure out how 'wide' each range is
    origSpan = origMax - origMin
    newSpan = newMax - newMin

    # Reduce the list to only contain categories with non zero values
    reduced = [ (name, value) for (name, value) in _list if value != 0 ]

    # Convert the original range into a 0-1 range (float)
    normalized = [( name, (float(value - origMin) / float(origSpan)) ) for (name, value) in reduced ]

    # Convert the 0-1 range into a value in the right range.
    scaled = [ (name, {"value": int(newMin + value * newSpan), "geocode": { "lat": 0, "lng": 0 } }) for (name, value) in normalized ]
    
    return scaled

# Input
#   list: ordered list of tuples, tuple[0] = key tuple[1] = dictionary of value of number 
#   and geocode dictionary of latitude and longitude coordinates
# Output
#   Updated geocode with latitude and longitude of the most prominent place for each category using Google PlaceServices
def get_prominent_geocode(_list, idx):
    _category_types = { "Food & Drink": [types.TYPE_FOOD],
                        "Spas & Wellness": [types.TYPE_SPA],
                        "Shopping": [types.TYPE_SHOPPING_MALL],
                        "Outdoor Activities": [],
                        "Amusement Parks": [types.TYPE_AMUSEMENT_PARK],
                        "Boat Tours & Water Sports": [],
                        "Sights & Landmarks": [],
                        "Nature & Parks": [],
                        "Zoos & Aquariums": [types.TYPE_ZOO, types.TYPE_AQUARIUM],
                        "Theater & Concerts": [types.TYPE_MOVIE_THEATER],
                        "Tours & Activities": [],
                        "Nightlife": [types.TYPE_NIGHT_CLUB, types.TYPE_BAR],
                        "Fun & Games": [],
                        "Traveler Resources": [types.TYPE_TRAVEL_AGENCY],
                        "Transportation": [],
                        "Classes & Workshops": [],
                        "Museums": [types.TYPE_MUSEUM],
                        "Casinos & Gambling": [types.TYPE_CASINO]
                    }
    geocode = geocodes[idx]
    minLat = min(geocode[0], geocode[2])
    maxLat = max(geocode[0], geocode[2])
    minLng = min(geocode[1], geocode[3])
    maxLng = max(geocode[1], geocode[3])

    for _category, _info in _list:
        geocode = _info["geocode"]
        lat = geocode["lat"]
        lng = geocode["lng"]
        loc = cities[idx]+", "+countries[idx]

        if len(_category_types[_category]) > 0:
            print("Finding coordinates for {0} in {1}".format(_category, loc))
            time.sleep(2)
            try:
                query_result = google_places.nearby_search(location=loc, keyword=_category,
                radius=20000, types=_category_types[_category])  
            except ValueError:
                continue
            except urllib2.HTTPError:
                continue
        else:
            #search with just keywords
            print("Finding coordinates for {0} in {1}".format(_category, loc))
            time.sleep(2)
            try:
                query_result = google_places.nearby_search(location=loc, keyword=_category,
                radius=20000)
            except ValueError:
                continue
            except urllib2.HTTPError:
                continue

        if query_result and len(query_result.places) > 0:
            coords = query_result.places[0].geo_location
            geocode["lat"] = float(coords["lat"])
            geocode["lng"] = float(coords["lng"])
        #else fail, provide random coordinates inside the boundary box of the city
        else:    
            geocode["lat"] = float("{0:.8f}".format(random.random() * (maxLat - minLat) + minLat))
            geocode["lng"] = float("{0:.8f}".format(random.random() * (maxLng - minLng) + minLng))
    return _list

scaled_data = [];
for _index, _city in enumerate(raw_data):
    scaled = even_distribution(_city.items())
    updated_city_items = get_prominent_geocode(scaled, _index)
    scaled_data.append(dict(updated_city_items))

for _index, _data in enumerate(scaled_data):
    scaled_data[_index] = {
        "name": cities[_index],
        "data": _data
    }

with open('attractions_bubble.json', 'w') as _file:
    json.dump(scaled_data, _file)
