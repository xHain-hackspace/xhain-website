// Show navigation on frontpage when scrolling down
$(window).scroll(function () {
  if ($(this).scrollTop() > $(window).height() - 107) {
    $("#frontpage header .logo").show();
    $("#frontpage header").fadeIn(300);
    $("#frontpage header").removeClass("displayed");
  } else {
    if (!$("#frontpage header").hasClass("displayed")) {
      $("#frontpage header").fadeOut(300);
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

  $("#frontpage-hero .logo").click(function () {
    $("#frontpage header #logo").hide();
    $("#frontpage header").fadeIn(300);
    $("#frontpage header").addClass("displayed");
  });
});

var map = L.map("map", {
  center: [52.51278, 13.44978],
  zoom: 16,
});

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var xHainIcon = L.icon({
  iconUrl: "/images/logo/xhain.svg",
  iconSize: [50, 50],
});

var marker = L.marker([52.51278, 13.44978], { icon: xHainIcon }).addTo(map);
