package main

import (
	"bytes"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"time"

	"github.com/apognu/gocal"
)

func main() {
	url := "https://files.x-hain.de/remote.php/dav/public-calendars/Yi63cicwgDnjaBHR/?export"

	// Define time range as current and next month.
	now := time.Now()
	timerange_start := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	timerange_end := timerange_start.AddDate(0, 2, -1)

	// Fetch and read ICS file
	data, err := fetchICalData(url)
	if err != nil {
		log.Printf("Failed to fetch or read the ICS file: %v\n", err)
		return
	}

	// Parse ICS file
	events, err := parseICSData(data, timerange_start, timerange_end)
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

type DayData struct {
	Events  []gocal.Event
	Weekday time.Weekday
	Date    time.Time
}

type TemplateData struct {
	Now         time.Time
	Events      map[int]map[string]map[int]DayData
	HtmlWrapper []template.HTML
}

func fetchICalData(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	icsData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return icsData, nil
}

func parseICSData(icsData []byte, start time.Time, end time.Time) ([]gocal.Event, error) {
	c := gocal.NewParser(bytes.NewReader(icsData))

	c.Start, c.End = &start, &end

	if err := c.Parse(); err != nil {
		return nil, err
	}

	// Sort the events by their start date
	sort.Slice(c.Events, func(i, j int) bool {
		return c.Events[i].Start.Before(*c.Events[j].Start)
	})

	return c.Events, nil
}

func generateHTML(events []gocal.Event, start time.Time, end time.Time) (string, error) {
	// Define your template functions
	funcMap := template.FuncMap{
		"monthName": func(month string) string {
			t, _ := time.Parse("01", month)
			return t.Format("January")
		},
		"isToday": func(t *time.Time) bool {
			return t.Format("2006-01-02") == time.Now().Format("2006-01-02")
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

	// Create a new template, attach the functions, and then parse the file
	t, err := template.New("template.html").Funcs(funcMap).ParseFiles("template.html")
	if err != nil {
		return "", err
	}

	// Group events by year, month, and day
	groupedEvents := make(map[int]map[string]map[int]DayData)

	for _, e := range events {

		year := e.Start.Year()
		month := e.Start.Format("01")
		day := e.Start.Day()

		if groupedEvents[year] == nil {
			groupedEvents[year] = make(map[string]map[int]DayData)
		}

		if groupedEvents[year][month] == nil {
			groupedEvents[year][month] = make(map[int]DayData)
		}

		dayData := groupedEvents[year][month][day]
		dayData.Events = append(dayData.Events, e)
		dayData.Weekday = e.Start.Weekday()
		if dayData.Date.IsZero() {
			dayData.Date = *e.Start
		}
		groupedEvents[year][month][day] = dayData
	}

	// Add days for these without events
	completeEvents := addEmptyDaysToEvents(groupedEvents, start, end)

	templateData := TemplateData{
		Now:         time.Now(),
		Events:      completeEvents,
		HtmlWrapper: []template.HTML{"{{< rawhtml >}}", "{{< /rawhtml >}}"},
	}

	// Generate HTML string
	var htmlBuffer bytes.Buffer
	if err := t.ExecuteTemplate(&htmlBuffer, "template.html", templateData); err != nil {
		return "", err
	}
	return htmlBuffer.String(), nil
}

func writeOutput(generatedHTML, filePath string) error {
	return os.WriteFile(filePath, []byte(generatedHTML), 0644)
}

func addEmptyDaysToEvents(events map[int]map[string]map[int]DayData, start, end time.Time) map[int]map[string]map[int]DayData {
	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		year := d.Year()
		month := d.Format("01")
		day := d.Day()

		if events[year] == nil {
			events[year] = make(map[string]map[int]DayData)
		}

		if events[year][month] == nil {
			events[year][month] = make(map[int]DayData)
		}

		if _, exists := events[year][month][day]; !exists {
			events[year][month][day] = DayData{
				Events:  []gocal.Event{},
				Weekday: d.Weekday(),
				Date:    d,
			}
		}
	}
	return events
}
