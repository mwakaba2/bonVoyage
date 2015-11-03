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

with open('attraction_links.json') as _input_file:
        data = json.load(_input_file)


# Overall attractions
def attractions_overall(_city):
    print "Getting overall attractions for " + _city["name"]
    # Download
    _html = urllib2.urlopen(_city["data"]).read()
    _soup = BeautifulSoup(_html, 'html.parser')
    # Extract
    _attraction_divs = _soup.findAll(
        "div",
        {"class": "filter filter_xor ", "id": lambda __id: "ATTR_CATEGORY" in __id}
    )
    _attractions = {}
    for __attraction_div in _attraction_divs:
        __name = __attraction_div.find("span", {"class": "filter_name"}).text
        __count = int(__attraction_div.find("span", {"class": "filter_count"}).text[1:-1])
        _attractions[__name] = __count
    return {
        "name": _city["name"],
        "data": _attractions
    }


with open('attractions_overall.json', 'w') as _output_file:
    json.dump(map(attractions_overall, data), _output_file)

