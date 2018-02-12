const userId = localStorage.getItem('userId');
const listId = localStorage.getItem('listId');

const settings = {
    url: `http://localhost:8080/api/users/${userId}/lists/${listId}`,
    dataType: 'json',
    contentType: 'application/json',
    type: 'GET',
    error: function(error) {
        console.log(error)
    },
    success: displayListItems
}

$.ajax(settings);

function displayListItems(data) {
    const listItems = data.items;
    listItems.forEach(item => {
        const result = renderListInput(item);
        $('#myList').append(result);
    })
}

function renderListTitle() {
    const listTitle = localStorage.getItem('listTitle');
    $('.title').html(listTitle);

    handleListBuildButton();
}

function handleListBuildButton() {
    $('.listBuildForm').on('submit', function(event) {
        event.preventDefault();
        const listInput = $('#myInput').val();
        const inputValue = renderListInput(listInput);

        $("#myList").append(inputValue);
        $('.listBuildForm')[0].reset();

        const settings = {
            url: 'http://localhost:8080/api/users/list/build',
            data: JSON.stringify({
                val: listInput,
                userId: userId,
                listTitle: localStorage.getItem('listTitle'),
                listId: listId
            }),
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            error: function(error) {
                console.log(error);
            },
            success: function(response) {
                console.log(response.lists)
            }
        }

        $.ajax(settings);
    });
}

function renderListInput(listInput) {
    return `
        <li>${listInput}</li>
    `;
}

$(renderListTitle);