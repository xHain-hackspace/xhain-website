// Cache DOM elements
var frontpageHeader = document.querySelector("#frontpage header");
var mobileNav = document.querySelector("#main-navigation .mobile");
var desktopNav = document.querySelector("#main-navigation .desktop");
var imageAttributionButton = document.querySelector(".image-attribution-button");
var imageAttributionInner = document.querySelector(".image-attribution-inner");

// Function to toggle class based on condition
function toggleClass(element, className, condition) {
    if (element) {
        element.classList.toggle(className, condition);
    }
}

// Handle scroll for frontpage header
window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (frontpageHeader) {
        toggleClass(frontpageHeader, "semi-transparent", scrollTop <= window.innerHeight - 107);
    }
});

// Initialize elements on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Toggle navigation for mobile view
    if (mobileNav) {
        mobileNav.addEventListener('click', function() {
            desktopNav.style.display = desktopNav.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (desktopNav) {
        desktopNav.addEventListener('click', function() {
            if (window.innerWidth < 620) {
                desktopNav.style.display = 'none';
            }
        });
    }

    // Set initial class for frontpage header
    if (frontpageHeader) {
        toggleClass(frontpageHeader, "semi-transparent", window.pageYOffset < window.innerHeight - 107);
    }
    // Toggle image attribution
    if (imageAttributionButton) {
        imageAttributionButton.addEventListener('click', function() {
            imageAttributionInner.style.display = imageAttributionInner.style.display === 'block' ? 'none' : 'block';
        });
    }
});
