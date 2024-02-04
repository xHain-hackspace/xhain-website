// global DOM elements and variables
const activeEventInterval = 1000 * 60 * 10; // 10 minutes
let $calendar = null;
let $modal = null;
let $overlay = null;
let modalTemplate = null;

// Main entrypoint
document.addEventListener("DOMContentLoaded", function () {
    $overlay = document.getElementById("overlay");
    $modal = document.getElementById("event_modal_template");
    modalTemplate = $modal.innerHTML;

    highlightCurrentDay();
    highlightCurrentEvents();
    // keep the current events highlighted
    setInterval(highlightCurrentEvents, activeEventInterval);
    setupModal();
    setTimeout(scrollToCurrentDay, 1000);
});

function getCurrentDateInfo() {
    const now = new Date();
    return {
        dateString: now.toLocaleDateString("en-CA"),
        currentTime: now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        }),
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
    document.getElementById(dateString).classList.add("current");

    // console.log(difference / 1000 / 60 / 60);
}

function highlightCurrentEvents() {
    const { dateString, currentTime } = getCurrentDateInfo();
    const now = new Date().toISOString();
    const events = document
        .getElementById(dateString)
        .querySelectorAll(".event");

    events?.forEach(function (event) {
        const { startTime, endTime } = event.dataset;

        if (now >= startTime && now < endTime) {
            const remainingEventTime = new Date(endTime) - now;
            event.classList.add("current");
            // Call this function again at the end of the event
            setTimeout(() => {
                highlightCurrentEvents();
            }, remainingEventTime + 1000);
        }
    });
}

function setupModal() {
    const modalTriggerSelector = ".event";
    // Add a single event listener to the container element, leveraging bubbling
    document
        .querySelector("#xhain_calendar")
        .addEventListener("click", (event) => {
            const clickedEvent = event.target.matches(modalTriggerSelector)
                ? event.target
                : event.target.closest(modalTriggerSelector);
            // it's possible that the click event was not on an event, so we need to check that
            if (clickedEvent) {
                openModal(clickedEvent);
            }
        });

    // Close modal when clicking on the overlay or close button
    $overlay.addEventListener("click", function (event) {
        if (event.target === $overlay || event.target.matches(".close")) {
            hideModal();
        }
    });

    // Setup for closing the modal with the ESC key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            hideModal();
        }
    });
}

function openModal(eventElement) {
    const eventData = { ...eventElement.dataset };
    $overlay.innerHTML = renderModal(modalTemplate, eventData);
    showModal();
}

// Given a string template formatted like a template literal,
// and an object of values, return the modified string.
function renderModal(template, args) {
    return Object.entries(args).reduce(
        (result, [arg, val]) => result.replace(`$\{${arg}}`, `${val}`),
        template
    );
}

function hideModal() {
    $overlay.setAttribute("aria-hidden", true);
}

function showModal() {
    $overlay.setAttribute("aria-hidden", false);
}
