const getList = {
url: 'http://localhost:8080/api/users/list',
dataType: 'json',
contentType: 'application/json',
type: 'GET',
error: function(err) {
    console.log(err)
},
success: userListData()
}
// Make call to API with ajax
$.ajax(getList);

function userListData(data) {
    console.log(data);
    listData = data;
    // const results = renderResult();
    // const title = titleResult();
    // $('.title').html(title);
}

// function titleResult () {
//     return `
//         <h2>${title}</h2>
//     `;
// }

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