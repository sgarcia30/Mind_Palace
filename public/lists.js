// import swal from 'sweetalert';

const userId = localStorage.getItem('userId');

const settings = {
	url: `/api/users/${userId}/list`,
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
		<li class="listTitle" data-id="${listId}" data-name="${title}">${title} <br class='res-break'><button class="delete-list">Delete</button> <button class="edit-list">Edit</button> </li>`
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
	url: `/api/users/${userId}/lists/${listId}`,
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

$('.listForm').on('submit', function(event) {
	event.preventDefault();
	const title = $('#listType').val();
	const date = $('#date').val();
	const category = $('#category').val();
    const userId = localStorage.getItem('userId');

	const settings = {
		url: '/api/users/list',
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
            if (response.message) {
            	swal({text: response.message, icon: 'error'
				});
            }
            else {
                localStorage.setItem('listId', response.listId);
                localStorage.setItem('listTitle', title);
                window.location = "listBuilding.html";
            }
        }
		}

    // Make call to API with ajax
    $.ajax(settings);
	});