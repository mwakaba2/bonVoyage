from bs4 import BeautifulSoup
import urllib2
import json
import geocoder
import time

with open('../attractions/attraction_links.json') as _input_file:
    data = json.load(_input_file)

with open('cities.json') as _cities_file:
    city_data = json.load(_cities_file)

raw_data = map(lambda i: i["data"], data)
cities = map(lambda i: i["name"], city_data)
countries = map(lambda i: i["country"], city_data)

def get_geocode(neighborhood, city, country):
    print "Getting geocode for " + neighborhood + ", " + city + ", " + country

    _geocode = []
    try:
        # sleep to avoid OVER QUERY LIMIT
        time.sleep(1)
        g = geocoder.google(neighborhood + ", " + city + ", " + country)
        bbox = g.bbox
        _geocode = bbox['northeast'] + bbox['southwest']
        print(_geocode)
    except AttributeError:
        print "Latlng not found for " + city + ", " + country
    except IndexError:
        print "Latlng not found for " + city + ", " + country
    except KeyError:
        print "Latlng not found for " + city + ", " + country
    return _geocode

# Overall attractions
def neighbors_overall(_url, city, country):
    print "Getting overall neighborhoods for " + _url
    # Download
    _html = urllib2.urlopen(_url).read()
    _soup = BeautifulSoup(_html, 'html.parser')
    # Extract
    _neighborhood_div = _soup.find_all('div', {'id': 'NEIGHBORHOOD_FILTER'})
    __neighbors = {}
    for tag in _neighborhood_div:
        _neighbors_div = tag.find_all('div', {'class': 'filter'})
        if _neighbors_div:
            _neighbors_div = _neighbors_div[:-2]
            for __neighbor in _neighbors_div:
                print(__neighbor)
                __name = __neighbor.find("span", {"class": "filter_name"}).text
                __count = int(__neighbor.find("span", {"class": "filter_count"}).text[1:-1])
                __neighbors[__name] = {
                    "value": __count,
                    "geocode": get_geocode(__name, city, country) 
                }
    return __neighbors


neighbors_data = [];
for _index, _link in enumerate(raw_data):
    neighbors = neighbors_overall(_link, cities[_index], countries[_index])
    neighbors_data.append(neighbors)
    print neighbors

for _index, _data in enumerate(neighbors_data):
    neighbors_data[_index] = {
        "name": cities[_index],
        "data": _data
    }

with open('neighbors_overall.json', 'w') as _output_file:
    json.dump(neighbors_data, _output_file)