package main

import (
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/xHain-hackspace/xhain-website/backend/internal/calendar"
	"github.com/xHain-hackspace/xhain-website/backend/internal/config"
	"github.com/xHain-hackspace/xhain-website/backend/internal/i18n"
)

type TemplateData struct {
	Months []MonthData
}

type MonthData struct {
	Year      int
	Month     string
	MonthName string
	Days      []DayData
}

type DayData struct {
	Date          time.Time
	Day           int
	WeekdayNumber int
	WeekdayName   string
	Events        []calendar.CalendarEvent
	IsEmpty       bool
}

func getDateRange() (time.Time, time.Time) {
	now := time.Now()
	// The first of the month has to be a 00:00:00 hours otherwise the math goes wonky
	startDate := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	endDate := startDate.AddDate(0, cfg.Calendar.MonthsToShow, 0)
	return startDate, endDate
}

func getDayData(day time.Time, events []calendar.CalendarEvent, language string) DayData {
	eventsOnDay := calendar.FilterEventsByDay(events, day)
	weekdayNames := i18n.GetWeekdayNames(language)
	return DayData{
		Date:          day,
		Day:           day.Day(),
		WeekdayNumber: int(day.Weekday()),
		WeekdayName:   weekdayNames[day.Weekday()],
		Events:        eventsOnDay,
		IsEmpty:       len(eventsOnDay) == 0,
	}
}

func getMonthData(month time.Time, events []calendar.CalendarEvent, language string) MonthData {
	days := []DayData{}

	monthNames := i18n.GetMonthNames(language)

	// Get all days in the month
	startOfMonth, endOfMonth := getDateRange()
	for d := startOfMonth; d.Before(endOfMonth); d = d.AddDate(0, 0, 1) {
		days = append(days, getDayData(d, events, language))
	}

	return MonthData{
		Year:      month.Year(),
		Month:     month.Month().String(),
		MonthName: monthNames[month.Month()],
		Days:      days,
	}
}

func transformCalendarEvents(events []calendar.CalendarEvent, language string) *TemplateData {
	months := []MonthData{}
	startDate, endDate := getDateRange()

	for startDate.Before(endDate) {
		months = append(months, getMonthData(startDate, events, language))
		startDate = startDate.AddDate(0, 1, 0)
	}
	return &TemplateData{
		Months: months,
	}
}

func calendarHandler(w http.ResponseWriter, r *http.Request) {
	// Calculate date range using configured months
	startDate, endDate := getDateRange()

	// get language from url from the first part of the path
	language := r.PathValue("language")
	if language != "de" && language != "en" {
		language = "en"
	}

	// get template
	tmpl, err := template.ParseFiles(filepath.Join(cfg.Server.StaticContent, language, "calendar", "index.html"))
	if err != nil {
		log.Printf("Error parsing template: %v", err)
		http.Error(w, "Failed to load template", http.StatusInternalServerError)
		return
	}

	// Get calendar data
	calendarEvents, err := cal.GetEvents(startDate, endDate)
	if err != nil {
		log.Printf("Error fetching calendar data: %v", err)
		http.Error(w, "Failed to load calendar data", http.StatusInternalServerError)
		return
	}
	transformedData := transformCalendarEvents(calendarEvents, language)

	// Create template data with calendar content
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	err = tmpl.Execute(w, transformedData)
	if err != nil {
		log.Printf("Error executing template: %v", err)
		http.Error(w, "Template execution error", http.StatusInternalServerError)
		return
	}
}

var (
	configFile string
	cfg        *config.Config
	cal        *calendar.Calendar
)

func init() {
	flag.StringVar(&configFile, "config", "config.yaml", "Path to the configuration file")
	flag.Parse()
}

func main() {

	// Load configuration
	var err error
	cfg, err = config.LoadConfig(configFile)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Set up logging based on config
	log.Printf("Starting xHain Calendar Backend with configuration:")
	log.Printf("  Server: %s:%d", cfg.Server.Host, cfg.Server.Port)
	log.Printf("  Static content: %s", cfg.Server.StaticContent)
	log.Printf("  Calendar URL: %s", cfg.Calendar.URL)
	log.Printf("  Cache TTL: %d minutes", cfg.Calendar.CacheTTLMinutes)
	log.Printf("  Months to show: %d", cfg.Calendar.MonthsToShow)

	// Set up calendar cache with configured TTL
	cal = calendar.NewCalendar(time.Duration(cfg.Calendar.CacheTTLMinutes)*time.Minute, cfg.Calendar.URL)

	mux := http.NewServeMux()

	// Validate static content directory
	if _, err := os.Stat(cfg.Server.StaticContent); os.IsNotExist(err) {
		log.Fatalf("Static content directory does not exist: %s", cfg.Server.StaticContent)
	}

	mux.Handle("/", http.FileServer(http.Dir(cfg.Server.StaticContent)))

	// Serve calendar pages
	mux.HandleFunc("/{language}/calendar/{$}", calendarHandler)
	mux.HandleFunc("/calendar/{$}", calendarHandler)

	addr := fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)
	log.Printf("Starting server on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
