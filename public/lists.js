function handleSubmitButton() {
	$('.listForm').on('submit', function(event) {
		event.preventDefault();
		console.log('do something');
		const title = $('#listType').val();
		const date = $('#date').val();
		const category = $('#category').val();

		const settings = {
    		url: 'http://localhost:8080/list',
    		data: JSON.stringify({
    			title: title,
    			date: date,
    			category: category
    			}),
    		dataType: 'json',
    		contentType: 'application/json',
    		type: 'POST',
    		success: getListDetails()
    		}

        // Make call to API with ajax
        $.ajax(settings);
  	});

    handleListBuildButton();
}

function getListDetails() {
    window.location = "listBuilding.html";
    const getList = {
    url: 'http://localhost:8080/list',
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