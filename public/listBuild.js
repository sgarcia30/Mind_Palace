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
// should this be at the bottome of the file?
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
        $('#myList').html('');


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

function renderListInput(listInput) {
    if (listInput.complete === true) {
        return `
            <li class="list-item__checked" data-listId="${listInput.itemId}" data-name="${listInput.item}"><button class="list-item-delete">Delete</button><div class="listVal">${listInput.item}</div></li>
        `;
    }
    else {
        return `
            <li class="list-item" data-listId="${listInput.itemId}" data-name="${listInput.item}"><button class="list-item-delete">Delete</button><div class="listVal">${listInput.item}</div></li>
        `;
    }

}

$('ul').on('click', ".list-item", function(event) {
    const itemId = $(this).attr('data-itemId');

    const settings = {
        url:`http://localhost:8080/api/users/list/build/item`,
        data: JSON.stringify({
            listId: listId,
            itemId: itemId,
            userId: userId
        }),
        dataType: 'json',
        contentType: 'application/json',
        type: 'PUT',
        error: function(error) {
            console.log(error);
        },
        success: function(response) {
            console.log(response);
            response.lists.forEach(list => {
                if(lists.listId === listId) {
                    list.items.forEach(obj => {
                        let inputValue = renderListInput(obj);
                        $("#myList").append(inputValue);
                        $('.listBuildForm')[0].reset(); 
                    })
                }
            })
        }
    }

    $.ajax(settings);
    // $(this).toggleClass('list-item__checked');
});

$('ul').on('click', '.list-item-delete', function(event) {
    const listItem = $(this).closest('li').attr("data-name");
    const itemIndex = $(this).closest('li').index();
    console.log(itemIndex);
    $(this).parents('li').remove();

    const settings = {
        url: `http://localhost:8080/api/users/${userId}/lists/${listId}/items/${itemIndex}`,
        dataType: 'json',
        contentType: 'application/json', 
        type: 'DELETE', //maybe it should be POST (cause we're updating)?
        error: function (error) {
            console.log(error)
        },
        success: function(response) {
            console.log(response)
        }
    }

    $.ajax(settings);
});

$(renderListTitle);