//Google Calendar shit goes here
var ical = require('ical')
, months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var today = new Date();
var todayStamp = today.toString().substring(0,15);

ical.fromURL('https://calendar.google.com/calendar/ical/thepascalrascal%40gmail.com/private-f9328e8831e969a9227a7bcfc319a650/basic.ics', {}, function(err, data) {
  var todaysEvents = [];
  for (var k in data){
    if (data.hasOwnProperty(k)) {
      var ev = data[k]
      var startDate = ev.start.toString();
      if(startDate.indexOf(todayStamp) != -1){
        todaysEvents.push(data[k]);
      }
    }
  }
  createEventWidget(todaysEvents);
  var todayHTML = document.getElementById("THEDATEOFTODAY");
  todayHTML.innerHTML = todayStamp;
});

var createEventWidget = function(events){
  var eventList = document.getElementById('currentEvents');
  for(var i in events){
    var startTime = getTime(events[i].start);
    var endTime = getTime(events[i].end);
    var eventTime = startTime + " - " + endTime;
    var dt = document.createElement('dt');
    dt.innerHTML = eventTime;
    var dd = document.createElement('dd');
    dd.innerHTML = events[i].summary;
    eventList.appendChild(dt);
    eventList.appendChild(dd);
  }
}

function getTime(date){
  var hours = date.getHours();
  if(hours > 12){
    hours = hours - 12;
  }
  var minutes = date.getMinutes();
  if(minutes >= 0 && minutes <= 9){
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
}
