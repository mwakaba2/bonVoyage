import cities_file_reader
from bs4 import BeautifulSoup
import urllib2
import json

# Input: cities.json file
# Input format:
# [{name: "name of the city", country: "country of that city"}, ...]

# Output: corresponding language.json file
# Output format:
# ["language name", ...]

# Read in cities.json
result = cities_file_reader.read_cities_file()
countries = result.countries

wiki_url = "http://en.wikipedia.org/wiki/"


# Languages
def language(_country):
    print "Getting language for " + _country
    # Download
    _url = wiki_url + _country
    _html = urllib2.urlopen(_url).read()
    _soup = BeautifulSoup(_html, 'html.parser')
    # Extract
    _language = ""
    try:
        _language = [e for e in _soup.find_all('th') if e.text == "Official languages"][0]\
            .parent\
            .td\
            .a\
            .text
    except AttributeError:
        print "Language not found for " + _country
    except IndexError:
        print "Language not found for " + _country
    return _language

languages = map(language, countries)
with open('language.json', 'w') as languages_file:
    json.dump(languages, languages_file)
