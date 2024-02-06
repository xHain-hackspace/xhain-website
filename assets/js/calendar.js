// cached DOM elements and variables
let $calendar = null;
let $modal = null;
let $overlay = null;
let modalTemplate = null;

// Main entrypoint
document.addEventListener("DOMContentLoaded", function () {
    $overlay = document.getElementById("overlay");
    $modal = document.getElementById("event_modal_template");
    modalTemplate = $modal.innerHTML;

    highlightCurrentEvents();
    setupModal();
    startBlinking(".event.current", 1500);
    setTimeout(scrollToCurrentDay, 1000);
});

function getCurrentDateInfo() {
    var today = new Date();
    return {
        dateString: today.toISOString().split("T")[0],
        currentTime: formatTime(today.getHours(), today.getMinutes()),
    };
}

function formatTime(hours, minutes) {
    return (
        (hours < 10 ? "0" : "") +
        hours +
        ":" +
        (minutes < 10 ? "0" : "") +
        minutes
    );
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

function highlightCurrentEvents() {
    var { dateString, currentTime } = getCurrentDateInfo();
    var currentDayElement = document.getElementById(dateString);

    if (currentDayElement) {
        currentDayElement.classList.add("current");
        var events = currentDayElement.querySelectorAll(".event");

        events.forEach(function (event) {
            var startTime = event.getAttribute("data-start-time");
            var endTime = event.getAttribute("data-end-time");

            if (currentTime >= startTime && currentTime <= endTime) {
                event.classList.add("current");
            }
        });
    }
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

// Given a string template formatted like a template literal,
// and an object of values, return the modified string.
function renderModal(template, args) {
    return Object.entries(args).reduce(
        (result, [arg, val]) => result.replace(`$\{${arg}}`, `${val}`),
        template
    );
}

function openModal(eventElement) {
    const eventData = { ...eventElement.dataset };
    $overlay.innerHTML = renderModal(modalTemplate, eventData);
    showModal();
}

function startBlinking(selector, interval) {
    const blinkingElements = document.querySelectorAll(selector);
    let isBlinking = true;

    function blink() {
        blinkingElements.forEach(function (element) {
            if (isBlinking) {
                element.style.opacity = "1";
            } else {
                element.style.opacity = "0.5";
            }
        });

        isBlinking = !isBlinking;
    }

    // Call the blink function at the specified interval (e.g., every 1.5 seconds)
    setInterval(blink, interval);
}

function hideModal() {
    $overlay.setAttribute("aria-hidden", true);
}

function showModal() {
    $overlay.setAttribute("aria-hidden", false);
}
