// Show navigation on frontpage when scrolling down
$(window).scroll(function () {
    if ($(this).scrollTop() > $(window).height() - 107) {
        $('#frontpage header .logo').show();
        $('#frontpage header').fadeIn(300);
        $('#frontpage header').removeClass("displayed");
    } else {
        if (!$('#frontpage header').hasClass('displayed')) {
            $('#frontpage header').fadeOut(300);
        }
    }
});

$(document).ready(function () {

    // Toggle navigation on mobile view
    $('#main-navigation .mobile').click(function () {
        $('#main-navigation .desktop').slideToggle(300);
    });
    $('#main-navigation .desktop').click(function () {
        if ($(window).width() < 620) {
            $('#main-navigation .desktop').hide();
        }
    });

    $("#frontpage-hero .logo").click(function () {
        $('#frontpage header #logo').hide();
        $('#frontpage header').fadeIn(300);
        $('#frontpage header').addClass("displayed");
    });
});
