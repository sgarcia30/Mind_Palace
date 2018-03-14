// Calls the setCardHeight function when page loads
$(document).ready(setCardHeight);

// Calls the setCardHeigh function when page is resized
$(window).resize(setCardHeight);

// Sets the heigh of all cards based on the tallest card
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