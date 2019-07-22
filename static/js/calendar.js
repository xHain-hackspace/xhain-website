document.addEventListener('DOMContentLoaded', function() {
  var initialLocaleCode = 'en';
  var localeSelectorEl = document.getElementById('locale-selector');
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'interaction', 'dayGrid', 'timeGrid', 'list', 'googleCalendar' ],
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridMonth,listMonth',
      locale: 'en'
    },
    locale: initialLocaleCode,
    buttonIcons: true, // show the prev/next text
    weekNumbers: false,
    navLinks: false, // can click day/week names to navigate views
    editable: false,
    eventLimit: true, // allow "more" link when too many events
    googleCalendarApiKey: 'AIzaSyAhG_Ds6PvH1YQZ2ZSKg2GhUgO-CsLdOWw',
    events: {
      googleCalendarId: 'xhain.cal@gmail.com'
    }
  });
  calendar.render();
  if(window.location.href.indexOf('/de/') > 0){
      calendar.setOption('locale', 'de');
  }
});