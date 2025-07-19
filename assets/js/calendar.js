// global DOM elements and variables
const activeEventInterval = 1000 * 60 * 10; // 10 minutes
let $calendar = null;

// Main entrypoint
document.addEventListener("DOMContentLoaded", function () {
    highlightCurrentDay();
    highlightCurrentEvents();
    // keep the current events highlighted
    setInterval(highlightCurrentEvents, activeEventInterval);
    setupEventDialogs();
    setTimeout(scrollToCurrentDay, 1000);
});

function formatTime(date) {
    // check if a date is being passed and use it or convert a string to a date
    const dateObject = date instanceof Date ? date : new Date(date);
    return dateObject.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getCurrentDateInfo() {
    const now = new Date();
    return {
        dateString: now.toISOString().split("T")[0],
        currentTime: formatTime(now),
    };
}

function scrollToCurrentDay() {
    var { dateString } = getCurrentDateInfo();
    var currentDayElement = document.getElementById(dateString);
    if (currentDayElement) {
        currentDayElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
}

function highlightCurrentDay() {
    const { dateString } = getCurrentDateInfo();
    const now = new Date();
    // Create a new Date object for midnight tomorrow
    const tomorrowMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
    );
    // Calculate the difference in milliseconds
    const msToTomorrow = tomorrowMidnight - now;
    // Call this function again at midnight
    setTimeout(() => {
        highlightCurrentDay();
    }, msToTomorrow);

    document.querySelector(".day.current")?.classList.remove("current");
    document.getElementById(dateString)?.classList.add("current");
}

function highlightCurrentEvents() {
    const { dateString, currentTime } = getCurrentDateInfo();
    const now = new Date();
    const events = document
        .getElementById(dateString)
        ?.querySelectorAll(".event");

    events?.forEach(function (event) {
        const { startTime, endTime } = event.dataset;
        const startTimeDate = Date.parse(startTime);
        const endTimeDate = Date.parse(endTime);

        if (now >= startTimeDate && now < endTimeDate) {
            const remainingEventTime = endTimeDate - now;
            event.classList.add("current");
            // Call this function again at the end of the event
            setTimeout(() => {
                highlightCurrentEvents();
            }, remainingEventTime + 1000);
        }
    });
}

function setupEventDialogs() {
    const modalTriggerSelector = ".event";
    // Add a single event listener to the container element, leveraging bubbling
    document
        .querySelector("#xhain_calendar")
        .addEventListener("click", (event) => {
            const target = event.target.matches(modalTriggerSelector)
                ? event.target
                : event.target.closest(modalTriggerSelector);
            // it's possible that the click event was not on an event, so we need to check that
            if (
                target &&
                event.button === 0 &&
                !(event.ctrlKey || event.shiftKey || event.metaKey)
            ) {
                const dialog = target.parentElement.querySelector("dialog");

                if (dialog) {
                    dialog.showModal();
                }

                event.preventDefault();
            }
        });
}
