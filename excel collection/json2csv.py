import json
import csv

# Open the JSON file for reading
with open('data.json', 'r') as json_file:

    # Load the contents of the JSON file
    data = json.load(json_file)

# Open the CSV file for writing
with open('data.csv', 'w', newline='') as csv_file:

    # Create a CSV writer object
    csv_writer = csv.writer(csv_file)

    # Write the header row
    csv_writer.writerow(data[0].keys())

    # Write the data rows
    for row in data:
        csv_writer.writerow(row.values())
