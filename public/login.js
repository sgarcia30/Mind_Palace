// Listener event for user login form
$('#loginForm').on('submit', function(event) {
	event.preventDefault();

	const email = $('#email').val();
	const pWord = $('#password').val();

	const settings = {
	url: '/api/auth/login',
	data: JSON.stringify({
		username: email,
		password: pWord
		}),
	dataType: 'json',
	contentType: 'application/json',
	type: 'POST',
	error: function(error) {
		swal({text: 'Incorrect email or password', icon: 'error'});
		$('#loginForm')[0].reset(); 
	},
	success: function(response) {
		console.log(response);
		localStorage.setItem("userToken", response.authToken);
		localStorage.setItem("userId", response.userId);
		window.location = "dashboard.html";
	}
	}

	$.ajax(settings);
})