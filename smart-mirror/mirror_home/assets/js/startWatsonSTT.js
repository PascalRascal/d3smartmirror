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
