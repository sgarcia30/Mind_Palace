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
		<li class="listTitle" data-id="${listId}" data-name="${title}">${title} <button class="edit-list">Edit</button> <button class="delete-list">Delete</button></li>`
}

$('.listVals').on('click', '.edit-list', function()  {
	const listId = $(this).closest('li').attr("data-id");
	const listTitle = $(this).closest('li').attr("data-name");
	localStorage.setItem('listId', listId);
	localStorage.setItem('listTitle', listTitle);
	window.location = "listBuilding.html";	
})

$('.listVals').on('click', '.delete-list', function()  {
	const listId = $(this).closest('li').attr("data-id");
	const listTitle = $(this).closest('li').attr("data-name");
	localStorage.setItem('listId', listId);
	localStorage.setItem('listTitle', listTitle);
	$(this).parents('li').remove();
	
	const settings = {
	url: `http://localhost:8080/api/users/${userId}/lists/${listId}`,
	dataType: 'json',
	contentType: 'application/json',
	type: 'DELETE',
	error: function(error) {
		console.log(error);
	},
	success: function(response) {
		console.log(response);
	}
}

$.ajax(settings);
})