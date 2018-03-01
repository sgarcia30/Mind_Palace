// Call this from the developer console and you can control both instances
var calendars = {};

$(document).ready( function() {

    // Here's some magic to make sure the dates are happening this month.
    var thisMonth = moment().format('YYYY-MM');
    // Events to load into calendar
    var eventArray = [];

    // Calendar setup
    calendars.clndr1 = $('.cal1').clndr({
        clickEvents: {
            click: function (target) {
                $('.listEvents').html('');
                $('#eventDetails').modal('toggle'); 
                const todayEvents = target.events;
                todayEvents.sort((event1, event2) => {
                      if(event1.startTime < event2.startTime) {
                        return -1;
                      }
                      if(event1.startTime > event2.startTime) {
                        return 1
                      }
                      return 0; 
                })
                $('#dayEventDate').html(`${target.date._d}`)
                todayEvents.forEach((event, index) => {
                    console.log(event);
                    $('.listEvents').append(`
                    <li class="eventTitle" data-id="${event.eventId}">
                        ${event.title}
                        <button class="delete-event">Delete</button>
                        <button class="edit-event">Edit</button>
                        <ul class='details'>
                            <li>Date(s): ${event.startDate} - ${event.endDate}</li>
                            <li>Time: ${event.startTime} - ${event.endTime}</li>
                        </ul>
                        <form class="updateEventForm">
                          <fieldset name="update">
                            <input type='hidden' class='editEventId' />
                            <input type="text" size="35" name="eventNameUpdate" class="eventNameUpdate" placeholder='Add title here' required/>
                            <label for="startDateUpdate">Start Date</label>
                            <input type="date" name="startDateUpdate" class="startDateUpdate" required/>
                            <label for="endDateUpdate">End Date (optional)</label>
                            <input type="date" name="endDateUpdate" class="endDateUpdate" />
                            <label for="startTimeUpdate">Start Time</label>
                            <input type="time" name="startTimeUpdate" class="startTimeUpdate" required/>
                            <label for="endTimeUpdate">End Time</label>
                            <input type="time" name="endTimeUpdate" class="endTimeUpdate" required />
                          </fieldset>
                          <button class='updateButton'>Update</button>
                        </form>
                    </li>
                    `)
                })
            }
        },
        multiDayEvents: {
            singleDay: 'date',
            endDate: 'endDate',
            startDate: 'startDate'
        },
        showAdjacentMonths: true,
        adjacentDaysChangeMonth: false
    });

    // Get user events
    const userId = localStorage.getItem('userId');

    const settings = {
        url: `http://localhost:8080/api/users/${userId}/calendar`,
        dataType: 'json',
        contentType: 'application/json',
        type: 'GET',
        error: function(error) {
            console.log(error);
        },
        success: function(events) {
            calendars.clndr1.addEvents(events);
        }
    }

    $.ajax(settings);

    // Create user event
    $('.eventForm').on('submit', function (event) {
        event.preventDefault();

        const eventName = $('#eventName').val();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const startTime = $('#startTime').val();
        const endTime = $('#endTime').val();
        const userId = localStorage.getItem('userId');
        $('.eventForm')[0].reset();

        const settings = {
            url: 'http://localhost:8080/api/users/calendar',
            data: JSON.stringify({
                title: eventName,
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                userId: userId
            }),
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            error: function(error) {
                console.log(error);
            },
            success: function(response) {
                $('#createEvent').modal('toggle');
                calendars.clndr1.addEvents(response.events);
            }
        }

        $.ajax(settings);
    })
});

// Show events for a given day when clicked on
$('.addEvent').on('click', function() {

})

// Delete a specified event
$('.listEvents').on('click', '.delete-event', function()  {
    const eventId = $(this).closest('li').attr("data-id");
    localStorage.setItem('eventId', eventId);
    $(this).parents('li').remove();
    const userId = localStorage.getItem('userId');
    
    const settings = {
        url: `http://localhost:8080/api/users/${userId}/calendar/${eventId}`,
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

$('.listEvents').on('click', '.edit-event', function() {
    // find which one I clicked on
    const eventId = $(this).closest('li').attr('data-id');
    localStorage.setItem('eventId', eventId);
    const userId = localStorage.getItem('userId');

    // make ajax request to get event info
    const settings = {
        url: `http://localhost:8080/api/users/${userId}/calendar/${eventId}`,
        dataType: 'json',
        contentType: 'application/json',
        type: 'GET',
        error: function(error) {
            console.log(error);
        },
        success: renderEventDetailstoEdit
    }

    $.ajax(settings);
})

// show a div with inputs using jQuery (on the current modal)
function renderEventDetailstoEdit(eventDetails) {
    // input details into the the div (like a form)
    // populate event details with relevant data
    $('.editEventId').val(eventDetails.eventId);
    $('.eventNameUpdate').val(eventDetails.title);
    $('.startDateUpdate').val(eventDetails.startDate);
    $('.endDateUpdate').val(eventDetails.endDate);
    $('.startTimeUpdate').val(eventDetails.startTime);
    $('.endTimeUpdate').val(eventDetails.endTime);
}

// listen for the form to be submitted
// get data submitted
// create ajax call to send it over
$('.listEvents').on('submit', '.updateEventForm', function(event) {
    event.preventDefault();
    
    const title = $('.eventNameUpdate').val();
    const startDate = $('.startDateUpdate').val();
    const endDate = $('.endDateUpdate').val();
    const startTime = $('.startTimeUpdate').val();
    const endTime = $('.endTimeUpdate').val();
    const eventId = $('.editEventId').val();
    const userId = localStorage.getItem('userId');
    localStorage.setItem('eventId', eventId);

    const settings = {
        url: `http://localhost:8080/api/users/${userId}/calendar/${eventId}`,
        data: JSON.stringify({
            title: title,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime
        }),
        dataType: 'json',
        contentType: 'application/json',
        type: 'PUT',
        error: function(error) {
            console.log(error);
        },
        success: updateEventUI
    }

    $.ajax(settings);
})

function updateEventUI(user) {
    const eventId = localStorage.getItem('eventId');
    const userEvents = user.events;
    const desEvent = userEvents.find(event => {
        return event.eventId === eventId;
    })

}