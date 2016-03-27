
// Build an array of all the currently installed services
var services = [];
var fs = require("fs"),
    path = require("path");
var p = "./services/"
fs.readdir(p, function (err, files) {
    if (err) {
      console.log(err);
        throw err;
    }

    files.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
      console.log(file);
      var serviceJSONString = fs.readFileSync(file + '/service.json');
      var service = JSON.parse(serviceJSONString);
      services.push(service);
      console.log(services);
    })
});

var getServiceFromAPIAI = function(data){

  if(data.result.source == "domains"){
    if(data.result.metadata.action == "media.music_play" && data.result.parameters){
      console.log('Playing a song!');
      console.log(data.result);
      musicPlay(data);
    }else if(data.result.metadata.action == "media.navigation_stop"){
      console.log('pausing');
      pauseYoutubeMusic();
    }
  }

  if(data.result.metadata.intentName == "AppLaunch"){
      launchApp(data);
  }

};

function musicPlay(data){
    if(data.result.parameters.title == null){
      findYoutubeMusic(data.result.parameters.q);
    }else{
      findYoutubeMusic(data.result.parameters.title);
    }
  }

function launchApp(data){
  var parameters= data.result.parameters;
    for(i = 0; i < services.length; i++){
      console.log("Looking at services!")
      if(parameters.serviceChoice == services[i].entity_name){
        addAnother(services[i]);
      }

    }
  }

function addAnother(service) {
    var ul = document.getElementById("applist");
    var li = document.createElement("li");

    var wrapper = document.getElementById("wrapper");

    var page = document.createElement("section");
    page.setAttribute("id",service.href);
    page.setAttribute("class","wrapper style1 fullscreen");
    var inner = document.createElement("div");

    var serviceHtml = fs.readFileSync('services/' + service.title + '/' + service.html);

    inner.innerHTML = serviceHtml.toString();
    var childNodes = inner.childNodes;
    page.appendChild(inner);

    wrapper.appendChild(page);

    var content = document.createElement("a");
    content.setAttribute("id", service.title);
    content.setAttribute("href", "#" + service.href);
    content.appendChild(document.createTextNode(service.title));

    li.appendChild(content);
    ul.appendChild(li)


    $.getScript("assets/js/sidebarhack.js", function(){

       console.log("Script loaded but not necessarily executed.");
       document.getElementById(service.title).click();

    });

    var serviceScript = fs.readFileSync('services/' + service.title + '/' + service.main).toString();
    console.log(serviceScript);
    eval(serviceScript);

    // Left over code from demo, might need later
    //catGetter.open("GET", "http://thecatapi.com/api/images/get?format=xml&results_per_page=1", true);
    //catGetter.send();

}
