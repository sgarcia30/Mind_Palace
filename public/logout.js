$('.logout').on('click', function() {
	localStorage.clear();
	window.location = "login.html";
})