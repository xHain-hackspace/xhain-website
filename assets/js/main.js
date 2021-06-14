// Show navigation on frontpage when scrolling down
$(window).scroll(function () {
  if ($(this).scrollTop() > $(window).height() - 107) {
    $("#frontpage header").removeClass("semi-transparent");
  } else {
    if (!$("#frontpage header").hasClass("semi-transparent")) {
      $("#frontpage header").addClass("semi-transparent");
    }
  }
});

$(document).ready(function () {
  // Toggle navigation on mobile view
  $("#main-navigation .mobile").click(function () {
    $("#main-navigation .desktop").slideToggle(300);
  });
  $("#main-navigation .desktop").click(function () {
    if ($(window).width() < 620) {
      $("#main-navigation .desktop").hide();
    }
  });
  if ($(window).scrollTop() < $(window).height() - 107) {
    $("#frontpage header").addClass("semi-transparent");
  }
});

var map = new maplibregl.Map({
  container: "map",
  style: "/js/map-style.json",
  center: [13.44978, 52.51278],
  zoom: 16,
});
map.addControl(new maplibregl.NavigationControl());

var size = 500;

// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
var pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  // When the layer is added to the map,
  // get the rendering context for the map canvas.
  onAdd: function () {
    var canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext("2d");
  },

  // Call once before every frame where the icon will be used.
  render: function () {
    var duration = 1000;
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

map.on("load", function () {
  map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

  map.addSource("dot-point", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [13.4497773, 52.5127904], // icon position [lng, lat]
          },
        },
      ],
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
