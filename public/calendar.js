const userId = localStorage.getItem('userId');

const settings = {
    url: `http://localhost:8080/api/users/${userId}/calendar`,
    dataType: 'json',
    contentType: 'application/json',
    type: 'GET',
    error: function(error) {
        console.log(error);
    },
    success: function(response) {
        console.log(response);
    }
}

$.ajax(settings);

$('.eventForm').on('submit', function (event) {
    event.preventDefault();

    const eventName = $('#eventName').val();
    const date = $('#date').val();
    const startTime = $('#startTime').val();
    const endTime = $('#endTime').val();
    const userId = localStorage.getItem('userId');
    $('.eventForm')[0].reset();

    const settings = {
        url: 'http://localhost:8080/api/users/calendar',
        data: JSON.stringify({
            name: eventName,
            date: date,
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
            // should I reload the page here, so it will retrieve the latest
            // event from the user?  If so, would I do that by simply using
            // window.location = "calendar.html";
            window.location = `http://localhost:8080/api/users/${response.redirect}`;
        }
    }

    $.ajax(settings);
})

// Call this from the developer console and you can control both instances
var calendars = {};

$(document).ready( function() {
    // Here's some magic to make sure the dates are happening this month.
    var thisMonth = moment().format('YYYY-MM');
    // Events to load into calendar
    var eventArray = [
        {
            title: 'Multi-Day Event',
            endDate: thisMonth + '-14',
            startDate: thisMonth + '-10'        
        }, {
            endDate: thisMonth + '-23',
            startDate: thisMonth + '-21',
            title: 'Another Multi-Day Event'
        }, {
            date: thisMonth + '-27',
            title: 'Single Day Event'
        }
    ];

    // The order of the click handlers is predictable. Direct click action
    // callbacks come first: click, nextMonth, previousMonth, nextYear,
    // previousYear, nextInterval, previousInterval, or today. Then
    // onMonthChange (if the month changed), inIntervalChange if the interval
    // has changed, and finally onYearChange (if the year changed).
    calendars.clndr1 = $('.cal1').clndr({
        events: eventArray,
        clickEvents: {
            click: function (target) {
                console.log('Cal-1 clicked: ', target);
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

    // Bind all clndrs to the left and right arrow keys
    $(document).keydown( function(e) {
        // Left arrow
        if (e.keyCode == 37) {
            calendars.clndr1.back();
            calendars.clndr2.back();
            calendars.clndr3.back();
        }

        // Right arrow
        if (e.keyCode == 39) {
            calendars.clndr1.forward();
            calendars.clndr2.forward();
            calendars.clndr3.forward();
        }
    });
});