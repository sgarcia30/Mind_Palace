const userId = localStorage.getItem('userId');

const settings = {
	url: `http://localhost:8080/api/users/${userId}/list`,
	dataType: 'json',
	contentType: 'application/json',
	type: 'GET',
	error: function(error) {
		console.log(error);
	},
	success: getListTitles
}

$.ajax(settings);

function getListTitles(data) {
	const lists = data.lists;
	
	lists.forEach( function(list) {
		const listTitle = list.title;
		const listId = list.listId;
		const val = renderListVal(listTitle, listId);
		$('.listVals').append(val);
	})
}

function renderListVal(title, listId) {
	return `
		<li class="listTitle" data-id="${listId}" data-name="${title}">${title}</li>`
}

$('.listVals').on('click', '.listTitle', function()  {
	const listId = $(this).attr("data-id");
	const listTitle = $(this).attr("data-name");
	localStorage.setItem('listId', listId);
	localStorage.setItem('listTitle', listTitle);
	window.location = "listBuilding.html";	
})