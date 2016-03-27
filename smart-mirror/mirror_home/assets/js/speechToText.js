"use strict"
var baseUrl = "https://api.api.ai/v1/";
$(document).ready(function() {
  $("#speechTranscript").keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      send();
    }
  });
});

var recognizing = false;
var final_transcript = '';


function startRecognition() {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognizing = true;

  recognition.onstart = function(event) {
    recognizing = true;
    console.log('Starting to listen!');
    console.log(recognition);
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    console.log('We got something!');
    if (typeof(event.results) == 'undefined') {
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
        $("#speechTranscript").val(interim_transcript);
      }
    }

    };

  recognition.onend = function() {
    console.log('No longer listening!')
  };

  recognition.onerror = function(event){

    console.log(event);
  }
  recognition.lang = "en-US";
  recognition.start();

};

startRecognition();
//Might need this later, for now though we dont
/*
function stopRecognition() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}
*/

function setInput(text) {
  $("#speechTranscript").val(text);
  console.log(text);
  send();
  final_transcript = '';
}

function send() {
  var text = $("#speechTranscript").val();
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
      getServiceFromAPIAI(data);
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
