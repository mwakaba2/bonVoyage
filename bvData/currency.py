import cities_file_reader
from bs4 import BeautifulSoup
import urllib2
import json

# Input: cities.json file
# Input format:
# [{name: "name of the city", country: "country of that city"}, ...]

# Output: corresponding currency.json file
# Output format:
# ["currency name", ...]

# Read in cities.json
result = cities_file_reader.read_cities_file()
countries = result.countries

wiki_url = "http://en.wikipedia.org/wiki/"


# Currencies
def currency(_country):
    print "Getting currency for " + _country
    # Download
    _url = wiki_url + _country
    _html = urllib2.urlopen(_url).read()
    _soup = BeautifulSoup(_html, 'html.parser')
    # Extract
    _currency = ""
    try:
        _currency = [e for e in _soup.find_all('th') if e.text == "Currency"][0]\
            .parent\
            .td\
            .text
    except AttributeError:
        print "Currency not found for " + _country
    except IndexError:
        print "Currency not found for " + _country
    return _currency

currencies = map(currency, countries)
with open('currency.json', 'w') as currencies_file:
    json.dump(currencies, currencies_file)
