import json

attributes = ["currency", "description", "image", "language", "timezone"]

files_names = map(lambda attribute: attribute + ".json", attributes)


def read_file(_file_name):
    with open(_file_name) as _file:
        _data = json.load(_file)
    return _data

attributes_data = map(read_file, files_names)

cities_data = read_file("cities.json")

for attribute_index in range(0, len(attributes)):
    attribute_name = attributes[attribute_index]
    for city_index in range(0, len(cities_data)):
        cities_data[city_index][attribute_name] = attributes_data[attribute_index][city_index]


with open("data.json", "w") as out_file:
    json.dump(cities_data, out_file)
