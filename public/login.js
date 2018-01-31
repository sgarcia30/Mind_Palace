$('.loginForm').on('submit', function(event) {
	event.preventDefault();

	const email = $('#email').val();
	const pWord = $('#password').val();

	const settings = {
	url: 'http://localhost:8080/api/auth/login',
	data: JSON.stringify({
		email: email,
		password: pWord
		}),
	dataType: 'json',
	contentType: 'application/json',
	type: 'POST',
	error: function(error) {
		console.log(error);
	},
	success: function(response) {
		console.log(response);
		// window.location = "login.html";
	}
	}

	// Make call to API with ajax
	$.ajax(settings);
})