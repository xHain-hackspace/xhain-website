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

var xHainIcon = document.createElement("div");
xHainIcon.classList.add("xhainicon");

var xhain = new maplibregl.Marker(xHainIcon, {
  anchor: "bottom",
  offset: [0, 6],
})
  .setLngLat([13.44978, 52.51278])
  .addTo(map);
