import cities_file_reader
from bs4 import BeautifulSoup
import urllib2
import json

# Input: cities.json file
# Input format:
# [{name: "name of the city", country: "country of that city"}, ...]

# Output: corresponding timezones.json file
# Output format:
# ["timezone name", ...]

# Read in cities.json
result = cities_file_reader.read_cities_file()
names = result.names

wiki_url = "http://en.wikipedia.org/wiki/"


# Timezones
def timezone(_name):
    print "Getting timezone for " + _name
    # Download
    _url = wiki_url + _name
    _html = urllib2.urlopen(_url).read()
    _soup = BeautifulSoup(_html, 'html.parser')
    # Extract
    _timezone = ""
    try:
        _timezone = _soup.find("a", {"title": "Time zone"})\
            .parent\
            .parent\
            .td\
            .a\
            .text
    except AttributeError:
        print "Timezone not found for " + _name
    return _timezone

timezones = map(timezone, names)
with open('timezones.json', 'w') as timezones_file:
    json.dump(timezones, timezones_file)
