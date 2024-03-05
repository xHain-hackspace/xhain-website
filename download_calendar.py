import json
import os
from datetime import datetime, timedelta

import pytz
import requests


def convert_to_berlin_timezone(dt_str, event_format):
    utc_zone = pytz.utc
    berlin_zone = pytz.timezone("Europe/Berlin")

    is_all_day = len(dt_str) == 10
    if is_all_day:
        return dt_str
    else:
        dt = datetime.strptime(dt_str, event_format)
        dt = utc_zone.localize(dt).astimezone(berlin_zone)
        return dt.strftime("%Y-%m-%dT%H:%M:%S%z")


os.makedirs("data", exist_ok=True)

first_date = datetime.now().replace(day=1)
first_date_ms = int(first_date.timestamp())
last_date = (first_date + timedelta(days=120)).replace(day=1) - timedelta(days=1)
last_date_ms = int(last_date.timestamp())

response = requests.get(
    f"https://files.x-hain.de/remote.php/dav/public-calendars/Yi63cicwgDnjaBHR/?export&accept=jcal&start={first_date_ms}&end={last_date_ms}&expand=1"
)
if response.status_code == 200:
    print(f"Data from {first_date.date()} to {last_date.date()} fetched successfully.")
    data = response.json()
else:
    print("Error fetching data.")
    exit(1)

try:
    # Extract and transform the data
    transformed_data = []
    for event in data[2]:
        event_data = {}
        for item in event[1]:
            key, value = item[0], item[3]
            if key in ["dtstart", "dtend"]:
                event_format = "%Y-%m-%dT%H:%M:%SZ" if "T" in value else "%Y-%m-%d"
                event_data[key] = convert_to_berlin_timezone(value, event_format)
            else:
                event_data[key] = value
        transformed_data.append(event_data)

    with open("data/calendar.json", "w") as outfile:
        json.dump(transformed_data, outfile, indent=2)
    print("Data transformed and saved successfully.")

except Exception as e:
    print(f"Error during data transformation: {e}")
    exit(1)
