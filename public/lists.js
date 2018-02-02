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
                window.location = "listBuilding.html";
            }
    		}

        // Make call to API with ajax
        $.ajax(settings);
  	});

    handleListBuildButton();
}

function getListDetails() {
    console.log('is this function working?');
    
    const getList = {
    url: 'http://localhost:8080/api/users/list',
    dataType: 'json',
    contentType: 'application/json',
    type: 'GET',
    success: userListData()
    }
    // Make call to API with ajax
    $.ajax(getList);
}

function userListData(data) {
    listData = data;
    const results = renderResult();
    const title = titleResult();
    $('.title').html(title);
}

function titleResult () {
    return `
        <h2>${title}</h2>
    `;
}

function handleListBuildButton() {
    $('.listBuildForm').on('submit', function(event) {
        event.preventDefault();
        const listInput = $('#myInput').val();
        const inputValue = renderList(listInput);

        $(".myList").html(inputValue);
    });
}

function listInput(listInput) {
    return `
        <li>${listInput}</li>
    `;
}

$(handleSubmitButton);