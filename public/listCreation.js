function handleSubmitButton() {
	$('.listForm').on('submit', function(event) {
		event.preventDefault();
		const title = $('#listType').val();
		const date = $('#date').val();
		const category = $('#category').val();
        const userId = localStorage.getItem('userId');

		const settings = {
    		url: 'http://localhost:8080/api/users/list',
    		data: JSON.stringify({
    			title: title,
    			date: date,
    			category: category,
                userId: userId
    			}),
    		dataType: 'json',
    		contentType: 'application/json',
    		type: 'PUT',
            error: function(error) {
                console.log(error)
            },
    		success: function(response) {
                console.log(response);
                localStorage.setItem('listTitle', title);
                window.location = "listBuilding.html";
            }
    		}

        // Make call to API with ajax
        $.ajax(settings);
  	});
}

$(handleSubmitButton);