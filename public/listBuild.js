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
                userId: localStorage.getItem('userId'),
                listTitle: localStorage.getItem('listTitle')
            }),
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            error: function(error) {
                console.log(error);
            },
            success: function(response) {
                console.log('does this work?')
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