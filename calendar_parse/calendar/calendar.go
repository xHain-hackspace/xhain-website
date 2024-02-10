package calendar

import (
	"fmt"
	"log"
	"net/http"
	"sort"
	"time"

	"github.com/emersion/go-ical"
)

type IcalData struct {
	url    string
	tz     *time.Location
	parsed *ical.Calendar
	logger *log.Logger
}

type Event struct {
	UID         string
	Start       time.Time
	End         time.Time
	Summary     string
	Location    string
	Description string
}

// Obtains an iCal from a given URL
func ImportCalendar(url string, l *log.Logger) (IcalData, error) {
	data := IcalData{url: url, tz: time.Local, logger: l}

	// Download the ICS file
	resp, err := http.Get(url)
	if err != nil {
		return data, err
	}
	defer resp.Body.Close()

	// Parse the ICS file
	parser := ical.NewDecoder(resp.Body)
	parsedData, err := parser.Decode()
	if err != nil {
		return data, err
	}

	data.parsed = parsedData
	return data, nil
}

// Assembles a list of events on a given date range
func (data IcalData) GetEventsOfRange(start time.Time, end time.Time) ([]Event, error) {
	var rangeEvents []Event

	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		dailyEvents, err := data.GetEventsOnDay(d)
		if err != nil {
			data.logger.Printf("could not get events for day %s: %s\n", d, err)
			continue
		}
		rangeEvents = append(rangeEvents, dailyEvents...)
	}

	return rangeEvents, nil
}

// Assembles a list of events on a single day
func (data IcalData) GetEventsOnDay(date time.Time) ([]Event, error) {

	allEvents := make(map[string]ical.Event)
	selectedEvents := make([]Event, 0)

	// Prepare map of all events
	for _, event := range data.parsed.Events() {

		uid := event.Props.Get(ical.PropUID).Value
		allEvents[uid] = data.handleDuplicates(uid, event, allEvents)

	}

	for _, event := range allEvents {

		// Checks whether event happens on the given date
		if data.isSingleEventOnDate(event, date) ||
			data.isRecurringEventOnDate(event, date) {

			convertedEvent, err := data.convertIcal(event, date)
			if err != nil {
				return nil, err
			}
			selectedEvents = append(selectedEvents, convertedEvent)
		}
	}

	sortEvents(selectedEvents)

	return selectedEvents, nil
}

// Checks whether the event is a single, standard event on the given date
func (data IcalData) isSingleEventOnDate(event ical.Event, date time.Time) bool {

	start, err := event.DateTimeStart(data.tz)
	if err != nil {
		data.logger.Printf("could not get start time: %s\n", err)
		return false
	}

	end, err := event.DateTimeEnd(data.tz)
	if err != nil {
		data.logger.Printf("could not get end time: %s\n", err)
		return false
	}

	todayStart := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, data.tz)
	todayEnd := todayStart.Add(24 * time.Hour)

	isRegularEvent := (start.After(todayStart) || start.Equal(todayStart)) && start.Before(todayEnd)
	isSpanningEvent := start.Before(todayStart) && end.After(todayEnd)

	return isRegularEvent || isSpanningEvent
}

// Checks whether an recurring event happens on a given date
func (data IcalData) isRecurringEventOnDate(event ical.Event, date time.Time) bool {
	recurrenceSet, err := event.RecurrenceSet(data.tz)
	if err != nil {
		data.logger.Printf("could not get recurrence set: %s\n", err)
		return false
	}
	if recurrenceSet == nil {
		return false
	}

	todayStart := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, data.tz)

	// Obtain the next recurrence date after todayStart.
	nextRecurrence := recurrenceSet.After(todayStart, true)

	// Use components of nextRecurrence to create a new date with a specific time set to midnight.
	recurrenceDate := time.Date(nextRecurrence.Year(), nextRecurrence.Month(), nextRecurrence.Day(), 0, 0, 0, 0, data.tz)

	return recurrenceDate.Equal(todayStart)
}

// Check for a duplicate and returns the right event
func (data IcalData) handleDuplicates(uid string, event ical.Event, allEvents map[string]ical.Event) ical.Event {

	newCandidate := event

	if _, ok := allEvents[uid]; ok {

		existingCandidate := allEvents[uid]

		existingCandidateCreatedProp := allEvents[uid].Props.Get(ical.PropCreated)
		if existingCandidateCreatedProp == nil {
			return existingCandidate
		}
		existingCandidateCreatedTime, err := existingCandidateCreatedProp.DateTime(data.tz)
		if err != nil {
			return existingCandidate
		}

		newCandidateCreatedProp := event.Props.Get(ical.PropCreated)
		if newCandidateCreatedProp == nil {
			return existingCandidate
		}

		newCandidateCreatedTime, err := newCandidateCreatedProp.DateTime(data.tz)
		if err != nil {
			return existingCandidate
		}

		// If there is a duplicate select the one that was created later
		if existingCandidateCreatedTime.After(newCandidateCreatedTime) {
			return existingCandidate
		}
	}

	return newCandidate
}

// Sorts events by start time
func sortEvents(events []Event) {
	sort.SliceStable(events, func(i, j int) bool {
		return events[i].Start.Before(events[j].Start)
	})
}

// Builds the object that is used to represent an event
func (data IcalData) convertIcal(icalEvent ical.Event, date time.Time) (Event, error) {
	event := Event{}

	// Handle UID
	uidProp := icalEvent.Props.Get(ical.PropUID)
	if uidProp != nil {
		event.UID = uidProp.Value
	} else {
		return event, fmt.Errorf("UID is missing for event %s", icalEvent.Name)
	}

	// Handle DTSTART
	startProp := icalEvent.Props.Get(ical.PropDateTimeStart)
	if startProp == nil {
		return event, fmt.Errorf("DTSTART is missing for event %s", icalEvent.Name)
	}
	eventStart, err := startProp.DateTime(data.tz)
	if err != nil {
		return event, err
	}
	event.Start = time.Date(date.Year(), date.Month(), date.Day(), eventStart.Hour(), eventStart.Minute(), 0, 0, date.Location())

	// Handle DTEND
	endProp := icalEvent.Props.Get(ical.PropDateTimeEnd)
	if endProp != nil {
		eventEnd, err := endProp.DateTime(data.tz)
		if err != nil {
			return event, err
		}
		// Calculate the difference in days and adjust Event.End
		daysDiff := int(eventEnd.Sub(eventStart).Hours() / 24)
		event.End = time.Date(date.Year(), date.Month(), date.Day()+daysDiff, eventEnd.Hour(), eventEnd.Minute(), 0, 0, date.Location())
	}

	// Handle SUMMARY
	summaryProp := icalEvent.Props.Get(ical.PropSummary)
	if summaryProp != nil {
		event.Summary = summaryProp.Value
	}

	// Handle LOCATION
	locationProp := icalEvent.Props.Get(ical.PropLocation)
	if locationProp != nil {
		event.Location = locationProp.Value
	}

	// Handle DESCRIPTION
	descriptionProp := icalEvent.Props.Get(ical.PropDescription)
	if descriptionProp != nil {
		event.Description = descriptionProp.Value
	} else {
		event.Description = ""
	}

	return event, nil
}
