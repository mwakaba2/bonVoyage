import json
import math

# Input: attraction_overall.json file
# Input format:
# [
#   {sight-seeing: 12, museums: 10, ...},
#   {museums: 7, ...},
#   ...
# ]

# Output: corresponding attractions_index.json file
# For each city-category pair, its index is computed as following:
# Form normal distribution for all categories within a city, assign index 1 to 5 for each category
# Form normal distribution for all cities within a category, assign index 1 to 5 for each city
# For each city-category, take the average of above two indices as the final index
# Output format:
# [
#   {sight-seeing: 4, museums: 3, ...},
#   {museums: 3, ...},
#   ...
# ]

with open('attractions_overall.json') as _input_file:
    raw_data = json.load(_input_file)

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
#   ordered preserved list of tuples, but each tuple's number normalized according to 1~5 indices
def normal_distribution(_list):
    _zero_length = _list.count(0)
    _non_zero_length = len(_list) - _zero_length
    # Compute thresholds for index 2 to 5
    # Index 2 to 5 corresponds to standard deviations -2, -1, 1, 2
    # Index 2 to 5 corresponds to percentiles 2.3%, 15.9%, 84.1%, 97.7%
    _thresholds = \
        [int(math.ceil(_non_zero_length * 0.023)),
         int(math.ceil(_non_zero_length * 0.159)),
         int(math.ceil(_non_zero_length * 0.841)),
         int(math.ceil(_non_zero_length * 0.977))]
    for __ii in range(len(_thresholds) - 1, 0, -1):
        _thresholds[__ii] -= _thresholds[__ii - 1]
    _thresholds.pop(0)

    # Compute number of numbers that should receive index from 0 to 5
    _counts = [-1] * 6
    _counts[0] = _zero_length
    _counts[2] = _thresholds[0]
    _counts[3] = _thresholds[1]
    _counts[4] = _thresholds[2]
    _remaining_counts = len(_list) - (_counts[0] + _counts[2] + _counts[3] + _counts[4])
    if _remaining_counts < 1:
        _counts[1] = 0
        _counts[5] = 0
    elif _remaining_counts == 1:
        _counts[1] = 0
        _counts[5] = 1
    else:
        __for_index_5 = int(math.ceil(_remaining_counts / 2))
        __for_index_1 = _remaining_counts - __for_index_5
        _counts[1] = __for_index_1
        _counts[5] = __for_index_5

    # Check if counts sum to length of list
    assert sum(_counts) == len(_list)

    # Sort the list of tuples by the number
    _list = sorted(_list, key=lambda x: x[1])

    # Distribute each original index with counts for index 0 to 5
    _ptr = 0
    _index = 0
    for __count in _counts:
        for ___i in range(__count):
            _list[_ptr] = (_list[_ptr][0], _index)
            _ptr += 1
        _index += 1

    return _list


# Collect indices vertically
vertical_indices = []
for _city in raw_data:
    vertical_indices.append(dict(normal_distribution(_city.items())))

# Collect indices horizontally
horizontal_indices = [None] * len(raw_data)
for _category in all_categories:
    _attractions_for_category = []
    for __city_index in range(0, len(raw_data)):
        __attractions_for_city = raw_data[__city_index][_category]
        _attractions_for_category.append((__city_index, __attractions_for_city))
    _attractions_for_category = normal_distribution(_attractions_for_category)
    for __t in _attractions_for_category:
        __city_index = __t[0]
        __index = __t[1]
        if horizontal_indices[__city_index] is None:
            horizontal_indices[__city_index] = {}
        horizontal_indices[__city_index][_category] = __index

# Compute final index for each city-category according to above indices
for _city_index in range(0, len(raw_data)):
    for __category in all_categories:
        __vertical_index = vertical_indices[_city_index][__category]
        __horizontal_index = horizontal_indices[_city_index][__category]
        __final_index = (__vertical_index + __horizontal_index) / 2
        raw_data[_city_index][__category] = __final_index

with open('attractions_index.json', 'w') as _file:
    json.dump(raw_data, _file)
