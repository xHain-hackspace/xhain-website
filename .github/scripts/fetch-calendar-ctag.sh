#!/usr/bin/env bash
# Fetches the CTag from a CalDAV calendar to detect changes
# Usage: fetch-calendar-ctag.sh <output-file>
#
# CTag (Collection Tag) is a CalDAV property that changes whenever any
# event in the calendar is added, modified, or deleted. By comparing
# the current CTag with the previous one, we can detect calendar changes
# without fetching and parsing all events.

set -euo pipefail

OUTPUT_FILE="${1:-new.ctag}"
CALENDAR_URL="https://files.x-hain.de/remote.php/dav/public-calendars/Yi63cicwgDnjaBHR/"

# PROPFIND request to get the CTag (no auth needed for public calendar)
if ! curl -s --fail --retry 3 --retry-delay 5 --max-time 30 -X PROPFIND \
  -H "Depth: 0" \
  -H "Content-Type: application/xml" \
  "$CALENDAR_URL" \
  --data '<?xml version="1.0"?>
  <d:propfind xmlns:d="DAV:" xmlns:cs="http://calendarserver.org/ns/">
    <d:prop>
      <cs:getctag/>
    </d:prop>
  </d:propfind>' \
  -o response.xml; then
  echo "::warning::CalDAV request failed"
  echo "fallback-$(date +%s)" > "$OUTPUT_FILE"
  exit 0
fi

# Extract CTag value using awk (portable)
CTAG=$(awk -F'[<>]' '/getctag/{for(i=1;i<=NF;i++)if($i~/:getctag$/||$i=="cs:getctag")print $(i+1)}' response.xml)

if [ -z "$CTAG" ]; then
  echo "::warning::Could not extract CTag from response"
  cat response.xml
  CTAG="fallback-$(date +%s)"
fi

echo "$CTAG" > "$OUTPUT_FILE"
echo "CTag: $CTAG"

# Cleanup
rm -f response.xml
