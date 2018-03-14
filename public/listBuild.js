// Sets the users ID and the list ID from the local storage
const userId = localStorage.getItem('userId');
const listId = localStorage.getItem('listId');

const settings = {
    url: `/api/users/${userId}/lists/${listId}`,
    dataType: 'json',
    contentType: 'application/json',
    type: 'GET',
    error: function(error) {
        console.log(error)
    },
    success: displayListItems
}

$.ajax(settings);

// Displays the list items in the UI
function displayListItems(data) {
    const listItems = data.items;
    listItems.forEach(item => {
        const result = renderListInput(item);
        $('#myList').append(result);
    })
}

// Renders the list title in the navbar
function renderListTitle() {
    const listTitle = localStorage.getItem('listTitle');
    $('.title').html(`Mind Palace -<br class='res-break'> ${listTitle}`);

    handleListBuildButton();
}

// When a new item is added to the list it sends the item to the backend
function handleListBuildButton() {
    $('.listBuildForm').on('submit', function(event) {
        event.preventDefault();
        const listInput = $('#myInput').val();
        $('#myList').html('');

        const settings = {
            url: '/api/users/list/build',
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
                const desList = response.lists.find(list => {
                    return list.listId === listId;
                })

                desList.items.forEach(obj => {
                    let inputValue = renderListInput(obj);
                    $("#myList").append(inputValue);
                    $('.listBuildForm')[0].reset(); 
                })                               
            }
        }

        $.ajax(settings);
    });
}

// Renders given list input to the UI on page load
function renderListInput(listInput) {
    if (listInput.complete) {
        return `
            <li class="list-item list-item__checked" data-itemId="${listInput.itemId}" data-name="${listInput.item}"><br class='res-break'><button class="list-item-delete">Delete</button><div class="listVal">${listInput.item}</div></li>
        `;
    }
    else {
        return `
            <li class="list-item" data-itemId="${listInput.itemId}" data-name="${listInput.item}"><br class='res-break'><button class="list-item-delete">Delete</button><div class="listVal">${listInput.item}</div></li>
        `;
    }
}

// When an item is checked off it sends that info to the backend
$('ul').on('click', ".list-item", function(event) {
    const itemId = $(this).attr('data-itemId');
    $(this).toggleClass('list-item__checked');

    const settings = {
        url:`/api/users/list/build/item`,
        data: JSON.stringify({
            listId,
            itemId,
            userId
        }),
        dataType: 'json',
        contentType: 'application/json',
        type: 'PUT',
        error: function(error) {
            console.log(error);
        },
        success: function(response) {
            console.log(response);
        }
    }

    $.ajax(settings);
});

// An event listener to delete an item from the list
$('ul').on('click', '.list-item-delete', function(event) {
    const listItem = $(this).closest('li').attr("data-name");
    const itemIndex = $(this).closest('li').index();
    $(this).parents('li').remove();

    const settings = {
        url: `/api/users/${userId}/lists/${listId}/items/${itemIndex}`,
        dataType: 'json',
        contentType: 'application/json', 
        type: 'DELETE',
        error: function (error) {
            console.log(error)
        },
        success: function(response) {
            console.log(response)
        }
    }

    $.ajax(settings);
});

// Calls the renderListTitle function on page load
$(renderListTitle);