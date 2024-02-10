package main

import (
	"bytes"
	"html/template"
	"log"
	"os"
	"strings"
	"time"

	cb "xhain/calendar_parse/calendar"
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

type DayData struct {
	Events  []cb.Event
	Weekday time.Weekday
	Date    time.Time
}

type TemplateData struct {
	Now         time.Time
	Events      map[int]map[string]map[int]DayData
	HtmlWrapper []template.HTML
}

func getICSData(url string, start, end time.Time) (map[int]map[string]map[int]DayData, error) {
	// Download and read ICS file
	data, err := cb.ImportCalendar(url, log.Default())
	if err != nil {
		return nil, err
	}

	events, err := data.GetEventsOfRange(start, end)
	if err != nil {
		return nil, err
	}

	// Initialize empty DayData for all days in the range first.
	days := make(map[int]map[string]map[int]DayData)
	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		year, month, day := d.Year(), d.Format("01"), d.Day()

		if _, ok := days[year]; !ok {
			days[year] = make(map[string]map[int]DayData)
		}

		if _, ok := days[year][month]; !ok {
			days[year][month] = make(map[int]DayData)
		}

		// Initialize as empty; events may be added below.
		days[year][month][day] = DayData{
			Date:    d,
			Events:  []cb.Event{},
			Weekday: d.Weekday(),
		}
	}

	// Sort in the events to the corresponding DayData
	for _, event := range events {

		eventYear, eventMonth, eventDay := event.Start.Year(), event.Start.Format("01"), event.Start.Day()
		dayData := days[eventYear][eventMonth][eventDay]
		dayData.Events = append(dayData.Events, event)
		days[eventYear][eventMonth][eventDay] = dayData
	}

	return days, nil
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
	htmlString = strings.ReplaceAll(htmlString, "\\,", ",")

	return htmlString, nil
}

func writeOutput(generatedHTML, filePath string) error {
	return os.WriteFile(filePath, []byte(generatedHTML), 0644)
}
