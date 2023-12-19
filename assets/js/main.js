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

var mapDiv = document.getElementById("map");
if (mapDiv) {
    var map = new maplibregl.Map({
        container: "map",
        style: "/js/mapstyle.json",
        center: [13.44978, 52.51278],
        zoom: 14,
    });
    map.scrollZoom.disable();
    map.addControl(new maplibregl.NavigationControl());

    var size = 300;


    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map.
    var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function() {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            // Set willReadFrequently to true for optimized performance
            this.context = canvas.getContext("2d", {
                willReadFrequently: true
            });
        },

        // Call once before every frame where the icon will be used.
        render: function() {
            var duration = 5000;
            var t = (performance.now() % duration) / duration;

            var radius = (size / 2) * 0.1;
            var outerRadius = (size / 2) * 0.9 * t + radius;
            var context = this.context;

            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
            context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
            context.fillStyle = "#aed919";
            context.strokeStyle = "white";
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            this.data = context.getImageData(0, 0, this.width, this.height).data;

            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            map.triggerRepaint();

            // Return `true` to let the map know that the image was updated.
            return true;
        },
    };

    map.on("load", function() {
        map.addImage("pulsing-dot", pulsingDot, {
            pixelRatio: 2
        });

        map.addSource("dot-point", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [{
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [13.4497773, 52.5127904],
                    },
                }, ],
            },
        });
        map.addLayer({
            id: "layer-with-pulsing-dot",
            type: "symbol",
            source: "dot-point",
            layout: {
                "icon-image": "pulsing-dot",
            },
        });
    });
}