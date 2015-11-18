from bs4 import BeautifulSoup
import urllib2
import json

# Input: attraction_links.json file
# Input format:
# ["http://...", ...]

# Output: corresponding attractions_overall.json file
# Output format:
# [
#   {
#       "Sights & Landmarks": 161,
#       "Museums": 77,
#       ...
#   },
#   ...
# ]

with open('../attractions/attraction_links.json') as _input_file:
    data = json.load(_input_file)

with open('cities.json') as _cities_file:
    city_data = json.load(_cities_file)

raw_data = map(lambda i: i["data"], data)
cities = map(lambda i: i["name"], data)

# Overall attractions
def neighbors_overall(_url):
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
                __neighbors[__name] = __count
    return __neighbors


neighbors_data = [];
for _index, _link in enumerate(raw_data):
    neighbors = neighbors_overall(_link)
    neighbors_data.append(neighbors)
    print neighbors

for _index, _data in enumerate(neighbors_data):
    neighbors_data[_index] = {
        "name": cities[_index],
        "data": _data
    }

with open('neighbors_overall.json', 'w') as _output_file:
    json.dump(neighbors_data, _output_file)