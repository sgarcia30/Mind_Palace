$(document).ready(setCardHeight);

$(window).resize(setCardHeight);

function setCardHeight() {
	let h = 0;
	$('.card').css('height', 'auto');

	$('.card').each(function(card) {
		if ($(this).height() > h) {
			h = $(this).height();
		}
	})

	$('.card').css('height', h + 'px');
}