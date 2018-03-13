function submitForm() {
	$('.registrationForm').on('submit', function (event) {
		event.preventDefault();

		const fName = $('#firstName').val();
		const lName = $('#lastName').val();
		const email = $('#email').val();
		const pword = $('#password').val();

		const settings = {
    		url: '/api/auth/register',
    		data: JSON.stringify({
    			firstName: fName,
    			lastName: lName,
    			email: email,
    			password: pword
    			}),
    		dataType: 'json',
    		contentType: 'application/json',
    		type: 'POST',
    		success: function(response) {
    			window.location = "login.html";
    		}
    		}

        // Make call to API with ajax
        $.ajax(settings);
	})
}

$(submitForm);