package main

import (
	"bytes"
	"html/template"
	"log"
	"os"
	"strings"
	"time"

	"github.com/gueldenstone/calendar-bot/pkg/calendar"
)

func main() {
	url := "https://files.x-hain.de/remote.php/dav/public-calendars/Yi63cicwgDnjaBHR/?export"

	// Define time range as current and next month.
	now := time.Now()
	timerange_start := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	timerange_end := timerange_start.AddDate(0, 2, -1)

	// Fetch and read ICS file
	events, err := getICSData(url, timerange_start, timerange_end)
	if err != nil {
		log.Printf("Failed to parse the ICS file: %v\n", err)
		return
	}

	// Render HTML
	generatedHTML, err := generateHTML(events, timerange_start, timerange_end)
	if err != nil {
		log.Printf("Error generating HTML: %v\n", err)
		return
	}

	// Include HTML in Hugo
	if err := writeOutput(generatedHTML, "../content/de/calendar.md"); err != nil {
		log.Printf("Error writing output: %v\n", err)
	}

	if err := writeOutput(generatedHTML, "../content/en/calendar.md"); err != nil {
		log.Printf("Error writing output: %v\n", err)
	}
}

type EventData struct {
	Start       time.Time
	End         time.Time
	Summary     string
	Location    string
	Description string
}

type DayData struct {
	Events  []EventData
	Weekday time.Weekday
	Date    time.Time
}

type TemplateData struct {
	Now         time.Time
	Events      map[int]map[string]map[int]DayData
	HtmlWrapper []template.HTML
}

func getICSData(url string, start time.Time, end time.Time) (map[int]map[string]map[int]DayData, error) {

	// Download and read ICS file
	calendar, err := calendar.NewCalendar(url, time.Local, log.Default())
	if err != nil {
		return nil, err
	}

	events := make(map[int]map[string]map[int]DayData)

	// Loop through days from start to end
	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		year := d.Year()
		month := d.Format("01")
		day := d.Day()

		// Initialize maps if necessary
		if events[year] == nil {
			events[year] = make(map[string]map[int]DayData)
		}
		if events[year][month] == nil {
			events[year][month] = make(map[int]DayData)
		}

		// If the day does not exist in the map, create a DayData with no events
		if _, exists := events[year][month][day]; !exists {
			events[year][month][day] = DayData{
				Events:  []EventData{},
				Weekday: d.Weekday(),
				Date:    d,
			}
		}

		// Fetch events for the day
		dailyICSEvents, err := calendar.GetEventsOn(d)
		if err != nil {
			return nil, err
		}

		// Convert ical.Event to EventData
		for _, icalEvent := range dailyICSEvents {

			eventStart, err := icalEvent.Props.DateTime("DTSTART", time.Local)
			if err != nil {
				return nil, err
			}
			eventData := EventData{
				Start: eventStart,
			}

			// Fetch end time, summary, location, description if they exist
			if endProp, ok := icalEvent.Props["DTEND"]; ok && len(endProp) > 0 {
				eventEnd, err := endProp[0].DateTime(time.Local)
				if err != nil {
					return nil, err
				}
				eventData.End = eventEnd
			}

			if summaryProp, ok := icalEvent.Props["SUMMARY"]; ok && len(summaryProp) > 0 {
				eventData.Summary, err = summaryProp[0].Text()
				if err != nil {
					return nil, err
				}
			}

			if locationProp, ok := icalEvent.Props["LOCATION"]; ok && len(locationProp) > 0 {
				eventData.Location, err = locationProp[0].Text()
				if err != nil {
					return nil, err
				}
			}

			if descriptionProp, ok := icalEvent.Props["DESCRIPTION"]; ok && len(descriptionProp) > 0 {
				eventData.Description, err = descriptionProp[0].Text()
				if err != nil {
					return nil, err
				}
			}

			// Append eventData to the day
			yearKey := eventData.Start.Year()
			monthKey := eventData.Start.Format("01")
			dayKey := eventData.Start.Day()

			if _, ok := events[yearKey]; !ok {
				events[yearKey] = make(map[string]map[int]DayData)
			}
			if _, ok := events[yearKey][monthKey]; !ok {
				events[yearKey][monthKey] = make(map[int]DayData)
			}
			if _, ok := events[yearKey][monthKey][dayKey]; !ok {
				events[yearKey][monthKey][dayKey] = DayData{
					Date:    eventData.Start,
					Events:  []EventData{},
					Weekday: eventData.Start.Weekday(),
				}
			}

			dayData := events[yearKey][monthKey][dayKey]
			dayData.Events = append(dayData.Events, eventData)
			events[yearKey][monthKey][dayKey] = dayData
		}

	}

	return events, nil
}

func generateHTML(events map[int]map[string]map[int]DayData, start time.Time, end time.Time) (string, error) {

	// Define template functions
	funcMap := template.FuncMap{
		"monthName": func(month string) string {
			t, _ := time.Parse("01", month)
			return t.Format("January")
		},
		"weekdayName": func(d time.Weekday) string {
			return d.String()
		},
		"weekdayShort": func(d time.Weekday) string {
			return d.String()[:3]
		},
		"now": func() time.Time {
			return time.Now()
		},
	}

	// Load template file
	t, err := template.New("template.html").Funcs(funcMap).ParseFiles("template.html")
	if err != nil {
		return "", err
	}

	templateData := TemplateData{
		Now:         time.Now(),
		Events:      events,
		HtmlWrapper: []template.HTML{"{{< rawhtml >}}", "{{< /rawhtml >}}"},
	}

	// Generate HTML string
	var htmlBuffer bytes.Buffer
	if err := t.ExecuteTemplate(&htmlBuffer, "template.html", templateData); err != nil {
		return "", err
	}

	htmlString := htmlBuffer.String()
	htmlString = strings.ReplaceAll(htmlString, "\\n", "<br>")

	return htmlString, nil
}

func writeOutput(generatedHTML, filePath string) error {
	return os.WriteFile(filePath, []byte(generatedHTML), 0644)
}
