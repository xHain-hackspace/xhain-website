package calendar

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/xHain-hackspace/go-jcal"
)

func fetchEvents(baseURL string, startDate, endDate time.Time) ([]CalendarEvent, error) {

	startUnix := startDate.Unix()
	endUnix := endDate.Unix()

	// build url using url.Values
	urlValues := url.Values{}
	urlValues.Add("export", "1")
	urlValues.Add("accept", "jcal")
	urlValues.Add("start", fmt.Sprintf("%d", startUnix))
	urlValues.Add("end", fmt.Sprintf("%d", endUnix))
	urlValues.Add("expand", "1")

	calendarURL, err := url.Parse(baseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse base URL: %w", err)
	}

	calendarURL.RawQuery = urlValues.Encode()

	fmt.Println(calendarURL.String())

	resp, err := http.Get(calendarURL.String())
	if err != nil {
		return nil, fmt.Errorf("failed to fetch calendar data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("calendar API returned status %d", resp.StatusCode)
	}

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Parse jcal data using JSON unmarshaling
	var jcalObject jcal.JCalObject
	if err := json.Unmarshal(body, &jcalObject); err != nil {
		return nil, fmt.Errorf("failed to parse jcal data: %w", err)
	}

	events := []CalendarEvent{}

	// Extract events from jcal data
	for _, event := range jcalObject.Events {
		calendarEvent := CalendarEvent{
			Summary:       event.Summary,
			Description:   event.Description,
			Location:      event.Location,
			StartTime:     event.DtStart,
			EndTime:       event.DtEnd,
			HTMLStartTime: event.DtStart.Format("2006-01-02T15:04:05-0700"),
			HTMLEndTime:   event.DtEnd.Format("2006-01-02T15:04:05-0700"),
		}
		events = append(events, calendarEvent)
	}

	return events, nil
}
