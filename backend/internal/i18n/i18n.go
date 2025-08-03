package i18n

import "time"

func GetMonthNames(language string) map[time.Month]string {
	if language == "de" {
		return map[time.Month]string{
			time.January:   "Januar",
			time.February:  "Februar",
			time.March:     "März",
			time.April:     "April",
			time.May:       "Mai",
			time.June:      "Juni",
			time.July:      "Juli",
			time.August:    "August",
			time.September: "September",
			time.October:   "Oktober",
			time.November:  "November",
			time.December:  "Dezember",
		}
	} else {
		return map[time.Month]string{
			time.January:   "January",
			time.February:  "February",
			time.March:     "March",
			time.April:     "April",
			time.May:       "May",
			time.June:      "June",
			time.July:      "July",
			time.August:    "August",
			time.September: "September",
			time.October:   "October",
			time.November:  "November",
			time.December:  "December",
		}
	}
}

func GetWeekdayNames(language string) map[time.Weekday]string {
	if language == "de" {
		return map[time.Weekday]string{
			time.Monday:    "Mon",
			time.Tuesday:   "Tue",
			time.Wednesday: "Wed",
			time.Thursday:  "Thu",
			time.Friday:    "Fri",
			time.Saturday:  "Sat",
			time.Sunday:    "Sun",
		}
	} else {
		return map[time.Weekday]string{
			time.Monday:    "Mon",
			time.Tuesday:   "Tue",
			time.Wednesday: "Wed",
			time.Thursday:  "Thu",
			time.Friday:    "Fri",
			time.Saturday:  "Sat",
			time.Sunday:    "Sun",
		}
	}
}
