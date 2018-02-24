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
                console.log(target);
                $('.listEvents').html('');
                $('#eventModal').modal('toggle');
                target.events.forEach((event, index) => {
                  $('.listEvents').append(`
                    <li class="eventTitle" data-id="${event.eventId}">${event.title} <button class="delete-event">Delete</button> <button class="edit-event">Edit</button></li>
                  `)
                })
            },
            today: function () {
                console.log('Cal-1 today');
            },
            nextMonth: function () {
                console.log('Cal-1 next month');
            },
            previousMonth: function () {
                console.log('Cal-1 previous month');
            },
            onMonthChange: function () {
                console.log('Cal-1 month changed');
            },
            nextYear: function () {
                console.log('Cal-1 next year');
            },
            previousYear: function () {
                console.log('Cal-1 previous year');
            },
            onYearChange: function () {
                console.log('Cal-1 year changed');
            },
            nextInterval: function () {
                console.log('Cal-1 next interval');
            },
            previousInterval: function () {
                console.log('Cal-1 previous interval');
            },
            onIntervalChange: function () {
                console.log('Cal-1 interval changed');
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
        $('#ex1').modal('toggle');
        $('.blocker').hide();

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
              $('.modal').toggle('hide');
              $('.blocker').hide()
              calendars.clndr1.addEvents(response.events);
            }
        }

        $.ajax(settings);
    })
});

// Show events for a given day when clicked on
$('.addEvent').on('click', function() {
    $('#eventModal').modal('toggle');
    $('.blocker').hide();
    $('#ex1').modal('toggle');
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