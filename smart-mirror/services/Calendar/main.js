console.log("Hello!");
var calendarFrame = document.getElementsByTagName('iframe');
calendarFrame = calendarFrame[0];
console.log(calendarFrame);
var injectoscript = ' var calendarContainer = document.getElementsByClassName("calendar-container"); calendarContainer = calendarContainer[0]; var calendarHeader = document.getElementsByClassName("header"); calendarHeader = calendarHeader[0]; calendarContainer.removeChild(calendarHeader);'
calendarFrame.contentWindow.eval('var calendarContainer = document.getElementsByClassName("calendar-container"); console.log(calendarContainer);');
