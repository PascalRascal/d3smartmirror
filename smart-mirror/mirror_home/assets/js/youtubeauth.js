//Node JS Code for interacting with Google's services, primary area of focus is YouTube
/*
  ~I can do it right or I can do it right now~
  Look at the code to see what I chose
*/
var google = require('googleapis');
var util = require('util');
const ipcRenderer = require('electron').ipcRenderer;

var html5musicplayer = document.getElementById('html5MusicSource');
html5musicplayer.addEventListener('canplay', function(){
  html5musicplayer.play();
})

ipcRenderer.on('youtubeMusicSrc', function(event, arg){
  console.log(arg);
  html5musicplayer.setAttribute("src", arg);
});

var youtube = google.youtube('v3');

var youtubeMusicPlayer = document.getElementById('youtubeMusicPlayer');

youtubeMusicPlayer.addEventListener("did-finish-load", function() {
  youtubeMusicPlayer.executeJavaScript("var elements = document.getElementsByTagName('video'); var playButton = elements[0]; console.log(playButton); require('electron').ipcRenderer.send('videoDOM', playButton.src);");
});


  var findYoutubeMusic = function(query){
    youtube.search.list({part:'snippet', q: query, key: YOUTUBE_APIKEY, maxResults: 5}, function (err, data) {
        if (err) console.log(err);
        if (data) getYoutubeSong(data);
      });
  }

  function getYoutubeSong(data){
    var items = data.items;
    for(i = 0; i < items.length; i++){
      if(items[i].snippet.title.toLowerCase().indexOf('lyrics') != -1){
        loadYoutubeSong(items[i].id.videoId)
        return;
      }
    }
    loadYoutubeSong(items[0].id.videoId);
  }

  function loadYoutubeSong(videoId){
    console.log('Playing video with Id ' + videoId);
    //document.getElementById('youtubeMusicPlayer').setAttribute('src','https://www.youtube.com/watch?v=9teDD_nY-KU?autoplay=1');
    youtubeMusicPlayer.loadURL('https://www.youtube.com/watch?v=' + videoId + '?autoplay=1');
  }


  var pauseYoutubeMusic = function(){
    html5musicplayer.pause();
  }

  var resumeYoutubeMusic = function(){
    html5musicplayer.play();
  }
