$(document).ready(function() {
    // Navigation bar click event
    $('.nav-link').click(function() {
        var section = $(this).data('section');
        $('.section').removeClass('active');
        $('#' + section).addClass('active');
    });
});
