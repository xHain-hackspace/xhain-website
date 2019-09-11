formatGoogleCalendar.init({
    calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/rr1u127f3df4p01bcaji408vcg%40group.calendar.google.com/events?key=AIzaSyCrlfMbjbgs_0dhlED01rP1CV6yidyD3l4',
    past: false,
    upcoming: true,
    sameDayTimes: true,
    pastTopN: 5,
    upcomingTopN: 15,
    recurringEvents: false,
    itemsTagName: 'li',
    upcomingSelector: '#events-upcoming',
    pastSelector: '#events-past',
    upcomingHeading: '',
    pastHeading: '<h2>Past events</h2>',
    format: ['*date*', ' ', '*summary*']
});