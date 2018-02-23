// Call this from the developer console and you can control both instances
var calendars = {};

$(document).ready( function() {

    // Here's some magic to make sure the dates are happening this month.
    var thisMonth = moment().format('YYYY-MM');
    // Events to load into calendar
    var eventArray = [];

    // Calendar setup
    calendars.clndr1 = $('.cal1').clndr({
        // events: eventArray,
        clickEvents: {
            click: function (target) {
                console.log(target);
                $('.events').html('');
                $('#eventModal').modal('toggle');
                target.events.forEach(event => {
                  $('.events').append(`
                    <li>${event.title}</li>
                  `)
                })
                // console.log('Cal-1 clicked: ', target.events);
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
        $('.modal').modal('toggle');
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

$('.addEvent').on('click', function() {
    console.log('an event');
    $('#eventModal').modal('toggle');
    $('.blocker').hide();
    $('#ex1').modal('toggle');
})


// // If you also have single day events with a different date field,
// // use the singleDay property and point it to the date field.
// singleDay: 'date'

// // When days from adjacent months are clicked, switch the current month.
// // fires nextMonth/previousMonth/onMonthChange click callbacks. defaults to
// // false.
// adjacentDaysChangeMonth: false,

// Mixing Multi- and Single-day Events
// If you also have single-day events mixed in with different date fields, as of clndr v1.2.7 you can specify a third property of multiDayEvents called singleDay that refers to the date field for a single-day event.

// var lotsOfMixedEvents = [
//     {
//         end: '2015-11-08',
//         start: '2015-11-04',
//         title: 'Monday to Friday Event'
//     }, {
//         end: '2015-11-20',
//         start: '2015-11-15',
//         title: 'Another Long Event'
//     }, {
//         title: 'Birthday',
//         date: '2015-07-16'
//     }
// ];

// $('#calendar').clndr({
//     events: lotsOfEvents,
//     multiDayEvents: {
//         endDate: 'end',
//         singleDay: 'date',
//         startDate: 'start'
//     }
// });