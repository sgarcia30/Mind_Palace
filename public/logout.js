// Listener event for user logging out
$('.logout').on('click', function() {
	localStorage.clear();
	window.location = "login.html";
})