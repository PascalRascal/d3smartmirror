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
  recognition.serviceURI = 'wami.csail.mit.edu';

  recognition.onstart = function(event) {
    recognizing = true;
    console.log('Starting to listen!');
    console.log(recognition);
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    var isCommand = false;
    console.log('We got something!');
    if (typeof(event.results) == 'undefined') {
      console.log('Undefined!');
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        console.log(final_transcript);
        if(isCommand = true){
          var command = final_transcript.slice(final_transcript.toLowerCase().search(MIRROR_NAME.toLowerCase()), final_transcript.length);
          console.log(command)
          setInput(command);
        }
      } else {
        var nameFound = false;
        for(var j = 0; j < event.results[i].length; j++){
          if(event.results[i][j].transcript.toLowerCase().search(MIRROR_NAME.toLowerCase()) > -1){
            interim_transcript += event.results[i][j].transcript;
            nameFound = true;
          }
        }
        if(nameFound == false && isCommand){
          interim_transcript += event.results[i][0].transcript;
        }else if(nameFound){
          isCommand = true;
        }

        if(isCommand){
          $("#speechTranscript").val(interim_transcript);
        }
      }
    }

    };

  recognition.onend = function() {
    console.log('No longer listening!')
  };

  recognition.onerror = function(event){
    console.log(event);
    if(event.error == "network"){
      var watsontokenGenerator = createTokenGenerator();
        watsontokenGenerator.getToken(function(err, token){
          if(token){
            var context = {
              currentModel: 'en-US_BroadbandModel',
              token: token,
              bufferSize: 8192
            };
            startListeningWatson(context);
          }
        });
      }
      else{
        recognition.start();
      }
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
  //Implement this when speech actually works haha
  //document.getElementById('speechTranscript').style.visibility = "hidden";
}

function send() {
  var inputSize = $("#speechTranscript").val().length;
  var text = $("#speechTranscript").val().slice(MIRROR_NAME.length + 1, inputSize); //This should work for most cases, need to test it out more
  /*
  for(var i = 0; i < text.length - 1; i++){
    if(text.charAt(i) == " "){
      if(text.charAt(i) == text.charAt(i + 1)){
        text.charAt(i) = "";
      }
    }
  }
  */
  console.log(text);
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
      console.log(data);
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
