var express = require('express'),
  watsonApp = express(),
  vcapServices = require('vcap_services'),
  extend = require('util')._extend,
  watson = require('watson-developer-cloud');

  var Wconfig = extend({
    version: 'v1',
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
    username: process.env.STT_USERNAME || '6b9ca230-5814-4d17-a99c-22a9dcb77625',
    password: process.env.STT_PASSWORD || 'Xm0dkjubgeOZ'
  }, vcapServices.getCredentials('speech_to_text'));

  var authService = watson.authorization(Wconfig);

var createTokenGenerator = function() {
  // Make call to API to try and get token
  var hasBeenRunTimes = 0;
  return {
    getToken: function(callback) {
      ++hasBeenRunTimes;
      if (hasBeenRunTimes > 5) {
        var err = new Error('Cannot reach server');
        callback(null, err);
        return;
      }
      /*
      var url = '/api/token';
      var tokenRequest = new XMLHttpRequest();
      tokenRequest.open('POST', url, true);
      tokenRequest.setRequestHeader('csrf-token',$('meta[name="ct"]').attr('content'));
      tokenRequest.onreadystatechange = function() {
        if (tokenRequest.readyState === 4) {
          if (tokenRequest.status === 200) {
            var token = tokenRequest.responseText;
            callback(null, token);
          } else {
            var error = 'Cannot reach server';
            if (tokenRequest.responseText){
              try {
                error = JSON.parse(tokenRequest.responseText);
              } catch (e) {
                error = tokenRequest.responseText;
              }
            }
            callback(error);
          }
        }
      };
      tokenRequest.send();
      */
      authService.getToken({url: Wconfig.url}, function(err, token) {
        if (err)
          console.log(err)
        else
          callback(null, token);
      });
    },
    getCount: function() { return hasBeenRunTimes; }
  };
};

var tokenGenerator = createTokenGenerator();

var initSocket = function(options, onopen, onlistening, onmessage, onerror, onclose) {
  var listening;
  // function withDefault(val, defaultVal) {
  //   return typeof val === 'undefined' ? defaultVal : val;
  // }
  var socket;
  var token = options.token;
  var model = options.model || localStorage.getItem('currentModel');
  var message = options.message || {'action': 'start'};
  // var sessionPermissions = withDefault(options.sessionPermissions,
  //   JSON.parse(localStorage.getItem('sessionPermissions')));
  // var sessionPermissionsQueryParam = sessionPermissions ? '0' : '1';
  // TODO: add '&X-Watson-Learning-Opt-Out=' + sessionPermissionsQueryParam once
  // we find why it's not accepted as query parameter
  // var url = options.serviceURI || 'wss://stream-d.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=';
  var url = options.serviceURI || 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=';
  url += token + '&model=' + model;
  console.log('URL model', model);
  try {
    socket = new WebSocket(url);
  } catch (err) {
    console.error('WS connection error: ', err);
  }
  socket.onopen = function() {
    listening = false;
    console.log("Wait what something opened");
    socket.send(JSON.stringify(message));
    onopen(socket);
  };
  socket.onmessage = function(evt) {
    var msg = JSON.parse(evt.data);
    if (msg.error) {
      console.log(msg.error);
      return;
    }
    if (msg.state === 'listening') {
      // Early cut off, without notification
      if (!listening) {
        onlistening(socket);
        listening = true;
      } else {
        console.log('MICROPHONE: Closing socket.');
        socket.close();
      }
    }
    onmessage(msg, socket);
  };

  socket.onerror = function(evt) {
    console.log('WS onerror: ', evt);
    showError('Application error ' + evt.code + ': please refresh your browser and try again');
    $.publish('clearscreen');
    onerror(evt);
  };

  socket.onclose = function(evt) {
    console.log('WS onclose: ', evt);
    if (evt.code === 1006) {
      // Authentication error, try to reconnect
      console.log('generator count', tokenGenerator.getCount());
      if (tokenGenerator.getCount() > 1) {
        $.publish('hardsocketstop');
        throw new Error('No authorization token is currently available');
      }
      tokenGenerator.getToken(function(err, token) {
        if (err) {
          $.publish('hardsocketstop');
          return false;
        }
        console.log('Fetching additional token...');
        options.token = token;
        initSocket(options, onopen, onlistening, onmessage, onerror, onclose);
      });
      return false;
    }
    if (evt.code === 1011) {
      console.error('Server error ' + evt.code + ': please refresh your browser and try again');
      return false;
    }
    if (evt.code > 1000) {
      console.error('Server error ' + evt.code + ': please refresh your browser and try again');
      return false;
    }
    // Made it through, normal close
    onclose(evt);
  };

};

var handleMicrophone = function(token, mic, callback) {

  // $.publish('clearscreen');

  // Test out websocket
  var baseString = '';
  var baseJSON = '';

  /*
  $.subscribe('showjson', function() {
    var $resultsJSON = $('#resultsJSON');
    $resultsJSON.val(baseJSON);
  });
  */



  var options = {};
  options.token = token;
  options.message = {
    'action': 'start',
    'content-type': 'audio/l16;rate=16000',
    'interim_results': true,
    'continuous': true,
    'word_confidence': true,
    'timestamps': true,
    'max_alternatives': 5,
    'inactivity_timeout': 600,
    'keywords': ["play", "Dorian"],
    'keywords_threshold': 0.01,
    'word_alternatives_threshold': 0.001,
  };
  options.model = 'en-US_BroadbandModel';

  function onOpen(socket) {
    console.log('Mic socket: opened');
    callback(null, socket);
  }

  function onListening(socket) {
    mic.onAudio = function(blob) {
      if (socket.readyState < 2) {
        socket.send(blob);
      }
    };
  }

  function onMessage(msg) {
    if (msg.results) {
      handleWatson(msg);
      // Convert to closure approach
      //THIS IS WHAT YOU OMODIFY TO HANDLE RESULTS FROM SPEECH TO TEXT
      baseJSON = JSON.stringify(msg, null, 2);
    }
  }

  function onError() {
    console.log('Mic socket err: ', err);
  }

  function onClose(evt) {
    console.log('Mic socket close: ', evt);
  }

  initSocket(options, onOpen, onListening, onMessage, onError, onClose);
};


var startListeningWatson = function(ctx){
  var token = ctx.token;
  var micOptions = {
      bufferSize: ctx.buffersize
  };
  var mic = new Microphone(micOptions);
  var running = false;

  if (!running) {
      console.log('Not running, handleMicrophone()');
      handleMicrophone(token, mic, function(err) {
        if (err) {
          var msg = 'Error: ' + err.message;
          console.log(msg);
          running = false;
        } else {
          console.log('starting mic');
          mic.record();
          running = true;
        }
      });
    } else {
      console.log('Stopping microphone, sending stop action message');
      mic.stop();
      running = false;
    }


}
