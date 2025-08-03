package calendar

import (
	"log"
	"time"
)

type Calendar struct {
	*CalendarCache
	baseURL string
}

func NewCalendar(ttl time.Duration, baseURL string) *Calendar {
	return &Calendar{
		CalendarCache: &CalendarCache{
			ttl: ttl,
		},
		baseURL: baseURL,
	}
}

type CalendarEvent struct {
	Summary       string    `json:"summary"`
	Description   string    `json:"description"`
	Location      string    `json:"location"`
	StartTime     time.Time `json:"start_time"`
	EndTime       time.Time `json:"end_time"`
	HTMLStartTime string    `json:"html_start_time"`
	HTMLEndTime   string    `json:"html_end_time"`
}

func FilterEventsByDay(events []CalendarEvent, day time.Time) []CalendarEvent {
	eventsOnDay := []CalendarEvent{}
	for _, event := range events {
		if event.StartTime.Day() == day.Day() && event.StartTime.Month() == day.Month() && event.StartTime.Year() == day.Year() {
			eventsOnDay = append(eventsOnDay, event)
		}
	}
	return eventsOnDay
}

func (c *Calendar) fetchEvents(startDate, endDate time.Time) ([]CalendarEvent, error) {
	return fetchEvents(c.baseURL, startDate, endDate)
}

func (c *Calendar) GetEvents(startDate, endDate time.Time) ([]CalendarEvent, error) {
	// Check cache first
	if cached, ok := c.getCachedEvents(); ok {
		log.Printf("Using cached data")
		return cached, nil
	}
	log.Printf("No cached data found, fetching fresh data")

	// measure time taken to fetch events
	now := time.Now()

	// Fetch fresh data
	data, err := c.fetchEvents(startDate, endDate)
	if err != nil {
		return nil, err
	}

	// Cache the data
	c.setCachedEvents(data)

	delta := time.Since(now)
	log.Printf("Fetch took %s", delta)

	return data, nil
}
