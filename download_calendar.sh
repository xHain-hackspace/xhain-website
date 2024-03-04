#!/bin/bash

# Create the data directory, handling errors if creation fails
mkdir -p data || { echo "Error creating directory 'data'"; exit 1; }

# Calculate the first and last dates of the current month
first_date=$(date +%Y-%m-01)
first_date_ms=$(date -d "$first_date" +%s)
last_date=$(date -d "$(date +%Y%m01) +3 month -1 day" +%Y-%m-%d)
last_date_ms=$(date -d "$last_date" +%s)

# Fetch data from the URL
curl -s "https://files.x-hain.de/remote.php/dav/public-calendars/Yi63cicwgDnjaBHR/?export&accept=jcal&start=$first_date_ms&end=$last_date_ms&expand=1" -o temp.json
if [ $? -eq 0 ]; then
    echo "Data from $first_date to $last_date fetched successfully."
else
    echo "Error fetching data."
    exit 1
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "jq could not be found, please install jq to process data."
    exit 1
fi

# Transform and save the fetched data
jq ".[2][][1] | map({key:.[0], value:.[3]}) | from_entries" temp.json | jq -s > data/calendar.json
if [ $? -eq 0 ]; then
    echo "Data transformed successfully."
else
    echo "Error processing data."
    exit 1
fi

# Clean up the temporary file
rm temp.json

