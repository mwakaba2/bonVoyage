import json
import math

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

cities = map(lambda i: i["name"], raw_data)
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
#   ordered preserved list of tuples, but each tuple's number normalized according to 20 - 150 indices
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
    scaled = [ (name, int(newMin + value * newSpan)) for (name, value) in normalized ]
    
    return scaled


scaled_data = [];
for _city in raw_data:
    scaled_data.append(dict(even_distribution(_city.items())))

for _index, _data in enumerate(scaled_data):
    scaled_data[_index] = {
        "name": cities[_index],
        "data": _data
    }

with open('attractions_bubble.json', 'w') as _file:
    json.dump(scaled_data, _file)
