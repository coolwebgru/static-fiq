$(document).ready(function () {
	$(window).scroll(function (event) {
		var scroll_height = $(window).scrollTop();
		var window_height = $(window).height()/4;
		if (scroll_height > 20) {
			if (!$('#header > nav').hasClass('overflowed-header')) {
				$('#header > nav').addClass('overflowed-header');
			}
		} else {
			if ($('#header > nav').hasClass('overflowed-header')) {
				$('#header > nav').removeClass('overflowed-header');
			}
		}
		if (scroll_height > window_height) {
			if ($('#topcontrol').hasClass('hide')) {
				$('#topcontrol').removeClass('hide');
			}
		} else {
			if (!$('#topcontrol').hasClass('hide')) {
				$('#topcontrol').addClass('hide');
			}
		}
	});

	$("#topcontrol").click(function () {
	   $("html, body").animate({scrollTop: 0}, 1000);
	});
});