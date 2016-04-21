var isWatsonCommand = false;
var handleWatson = function(msg){
  var results = msg.results[0];
  var transcript = results.alternatives[0].transcript;
  if (transcript.toLowerCase().search(MIRROR_NAME.toLowerCase()) > -1){
    transcript = transcript.slice(transcript.toLowerCase().search(MIRROR_NAME.toLowerCase()), transcript.length);
    isWatsonCommand = true;
    $("#speechTranscript").val(transcript);
    $("#speechTranscript").show();
  }
  console.log(transcript);
  if(results.final && isWatsonCommand){
    var command = transcript.replace("clay", "play"); //This is a solution to a common error in IBM Watson where it mistakes play for clay
    console.log("We THINK this is the command");
    $("#speechTranscript").val(command);
    console.log(command);
    isWatsonCommand = false;
    send();
    $("#speechTranscript").hide();
  }
}
