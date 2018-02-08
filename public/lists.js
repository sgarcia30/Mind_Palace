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

function getListTitles(data) {
	const lists = data.lists;
	
	lists.forEach( function(list) {
		const listTitle = list.title;
		const val = renderListVal(listTitle);
		$('.listVals').append(val);
	})
}

function renderListVal(val) {
	return `
		<li>${val}</li>`
}

$.ajax(settings);