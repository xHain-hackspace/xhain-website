document.addEventListener("DOMContentLoaded", function() {
    scrollToCurrentDay();
    highlightCurrentEvents();
    setupModalFunctionality();
});

function getCurrentDateInfo() {
    var today = new Date();
    return {
        dateString: today.toISOString().split('T')[0],
        currentTime: formatTime(today.getHours(), today.getMinutes())
    };
}

function formatTime(hours, minutes) {
    return (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes;
}

function scrollToCurrentDay() {
    var {
        dateString
    } = getCurrentDateInfo();
    var currentDayElement = document.getElementById(dateString);

    if (currentDayElement) {
        currentDayElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        currentDayElement.classList.add("current");
    }
}

function highlightCurrentEvents() {
    var {
        dateString,
        currentTime
    } = getCurrentDateInfo();
    var currentDayElement = document.getElementById(dateString);

    if (currentDayElement) {
        var events = currentDayElement.querySelectorAll(".event");

        events.forEach(function(event) {
            var startTime = event.getAttribute("data-start-time");
            var endTime = event.getAttribute("data-end-time");

            if (currentTime >= startTime && currentTime <= endTime) {
                event.classList.add("current");
            }
        });
    }
}

function setupModalFunctionality() {
    var modal = document.getElementById("eventModal");

    document.querySelectorAll('.event.with-description').forEach(function(eventElement) {
        eventElement.addEventListener('click', function() {
            openModal(eventElement);
        });
    });

    setupCloseModalButton(modal);
}

function openModal(eventElement) {
    var modal = document.getElementById("event_modal");

    document.getElementById("info_date_time").innerText = eventElement.querySelector('.time').innerText;
    document.getElementById("info_location").innerText = eventElement.querySelector('.location').innerText;
    document.getElementById("info_title").innerText = eventElement.querySelector('.title').innerText;
    document.getElementById("info_description").innerText = eventElement.querySelector('.description').innerText;

    modal.style.display = "block";
}


function setupModalFunctionality() {
    // Setup for opening the modal
    document.querySelectorAll('.event.with-description').forEach(function(eventElement) {
        eventElement.addEventListener('click', function() {
            openModal(eventElement);
        });
    });

    // Setup for closing the modal with the close button
    var closeModalButton = document.querySelector("#event_modal .close");
    if (closeModalButton) {
        closeModalButton.onclick = function() {
            document.getElementById("event_modal").style.display = "none";
        };
    }

    // Setup for closing the modal by clicking outside of it
    window.onclick = function(event) {
        var modal = document.getElementById("event_modal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Setup for closing the modal with the ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            var modal = document.getElementById("event_modal");
            if (modal.style.display === "block") {
                modal.style.display = "none";
            }
        }
    });
}

window.onclick = function(event) {
    var modal = document.getElementById("event_modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};