//Node JS Code for interacting with Google's services, primary area of focus is YouTube
/*
  ~I can do it right or I can do it right now~
  Look at the code to see what I chose
*/
var google = require('googleapis');
var util = require('util');


var youtube = google.youtube('v3');

var youtubeMusicPlayer = document.getElementById('youtubeMusicPlayer');

youtubeMusicPlayer.addEventListener("dom-ready", function() {
  console.log('dom is ready');
  youtubeMusicPlayer.openDevTools()
  youtubeMusicPlayer.executeJavaScript('var element1 = document.createElement("script");element1.src = "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js";element1.type="text/javascript";document.getElementsByTagName("head")[0].appendChild(element1);', function(){
    console.log('jquery injected!');
  });
});
youtubeMusicPlayer.addEventListener('media-started-playing', function(){
  console.log('Music is now playing');
})


  var findYoutubeMusic = function(query){
    youtube.search.list({part:'snippet', q: query, key: YOUTUBE_APIKEY, maxResults: 5}, function (err, data) {
        if (err) console.log(err);
        if (data) getYoutubeSong(data);
      });
  }

  function getYoutubeSong(data){
    var items = data.items;
    console.log(data);
    for(i = 0; i < items.length; i++){
      if(items[i].snippet.title.toLowerCase().indexOf('lyrics') != -1){
        loadYoutubeSong(items[i].id.videoId)
        return;
      }
    }
    loadYoutubeSong(items[0].id);
  }

  function loadYoutubeSong(videoId){
    console.log('Here we go!');
    //document.getElementById('youtubeMusicPlayer').setAttribute('src','https://www.youtube.com/watch?v=9teDD_nY-KU?autoplay=1');
    youtubeMusicPlayer.loadURL('https://www.youtube.com/watch?v=' + videoId + '?autoplay=1');
  }
