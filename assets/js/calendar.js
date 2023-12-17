// Main entrypoint
document.addEventListener("DOMContentLoaded", function() {
    highlightCurrentEvents();
    setupModal()
    startBlinking('.event.current', 1500);
    setTimeout(scrollToCurrentDay, 1000);
});

function getCurrentDateInfo() {

    var today = new Date()

    // Timezone handling
    var berlinOffset = 60;
    if (today.getMonth() > 2 && today.getMonth() < 9) {
        berlinOffset = 120;
    }
    today = new Date(today.getTime() + berlinOffset * 60000)

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
    }
}

function highlightCurrentEvents() {
    var {
        dateString,
        currentTime
    } = getCurrentDateInfo();
    var currentDayElement = document.getElementById(dateString);

    if (currentDayElement) {
        currentDayElement.classList.add("current");
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



function setupModal() {

    // Hide description and location
    const elementsToHide = document.querySelectorAll('.location, .description');
    elementsToHide.forEach(element => {
        element.style.display = 'none';
    });

    // Setup for opening the modal
    document.querySelectorAll('.event.with-description').forEach(function(eventElement) {
        eventElement.addEventListener('click', function() {
            openModal(eventElement);
        });
        eventElement.classList.add('clickable');
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


function openModal(eventElement) {
    var modal = document.getElementById("event_modal");

    document.getElementById("info_date_time").innerText = eventElement.querySelector('.time').innerText;
    document.getElementById("info_location").innerText = eventElement.querySelector('.location').innerText;
    document.getElementById("info_title").innerText = eventElement.querySelector('.title').innerText;
    document.getElementById("info_description").innerHTML = eventElement.querySelector('.description').innerHTML;

    modal.style.display = "block";
}


function startBlinking(selector, interval) {
    const blinkingElements = document.querySelectorAll(selector);
    let isBlinking = true;

    function blink() {
        blinkingElements.forEach(function(element) {
            if (isBlinking) {
                element.style.opacity = '1';
            } else {
                element.style.opacity = '0.5';
            }
        });

        isBlinking = !isBlinking;
    }

    // Call the blink function at the specified interval (e.g., every 1.5 seconds)
    setInterval(blink, interval);
}

window.onclick = function(event) {
    var modal = document.getElementById("event_modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};