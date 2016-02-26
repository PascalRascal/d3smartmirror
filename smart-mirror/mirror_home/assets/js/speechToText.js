"use strict"
var baseUrl = "https://api.api.ai/v1/";
$(document).ready(function() {
  $("#input").keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      addAnother("hello","funnBoy");
      addAnother("hello1","funnBoy2");
      addAnother("hello2","funnBoy3");
      addAnother("hello3","funnBoy4");
      addAnother("hello4","funnBoy5");
      send();
    }
  });
});
var recognition;
var recognizing = false;
var ignore_onend;
var final_transcript = '';
function startRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognizing = true;

  recognition.onstart = function(event) {
    recognizing = true;
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      console.log('Undefined!');
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        console.log(final_transcript);
        setInput(final_transcript);
      } else {
        interim_transcript += event.results[i][0].transcript;
        $("#input").val(interim_transcript);
      }
    }
    };

  recognition.onend = function() {
  };
  recognition.lang = "en-US";
  recognition.start();
};

startRecognition();

function stopRecognition() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}

function setInput(text) {
  $("#input").val(text);
  console.log(text);
  send();
  final_transcript = '';
}

function send() {
  var text = $("#input").val();
  $.ajax({
    type: "POST",
    url: baseUrl + "query/",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      "Authorization": "Bearer " + APIAI_ACCESSTOKEN,
      "ocp-apim-subscription-key": APIAI_SUBSCRIPTIONKEY
    },
    data: JSON.stringify({ q: text, lang: "en" }),
    success: function(data) {
      setResponse(JSON.stringify(data, undefined, 2));
    },
    error: function() {
      setResponse("Internal Server Error");
    }
  });
  setResponse("Loading...");
}
function setResponse(val) {
  $("#response").text(val);
}

function addAnother(href, title) {
    var ul = document.getElementById("applist");
    console.log(ul.innerHTML);
    var li = document.createElement("li");

    var wrapper = document.getElementById("wrapper");

    var page = document.createElement("section");
    page.setAttribute("id",href);
    page.setAttribute("class","wrapper style1 fullscreen");
    var inner = document.createElement("div");
    inner.innerHTML = "<h1> Hello Friends </hi> <p> Invest in Bitcoin!</p>";
    var script = document.createElement("script");
    page.appendChild(inner);

    wrapper.appendChild(page);



    var content = document.createElement("a");
    content.setAttribute("id", title);
    content.setAttribute("href", "#" + href);
    content.appendChild(document.createTextNode(title));

    li.appendChild(content);
    ul.appendChild(li)


    $.getScript("assets/js/sidebarhack.js", function(){

       console.log("Script loaded but not necessarily executed.");

    });
    console.log(li.innerHTML);

}
