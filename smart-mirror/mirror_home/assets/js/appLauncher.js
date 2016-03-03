var fs = require("fs");
var catAppActive = false;

var catGetter = new XMLHttpRequest();
catGetter.onreadystatechange = function() {
  if (catGetter.readyState == 4 && catGetter.status == 200) {
      //First part finds the img tag for the catapp, second part sets the source to the cat image requested
      document.getElementById("catapp").firstElementChild.children[1].setAttribute("src", catGetter.responseXML.getElementsByTagName("url")[0].innerHTML);
  }
};

var getServiceFromAPIAI = function(data){
    var result = data.result;
    if(result.action == 'new_cat'){
      //This is backwards logically but I dont even care
      //TODO: make this make sense
      if(catAppActive == false){
        launchDemoApp(result.parameters);
        catAppActive = true;
      }else{
        catGetter.open("GET", "http://thecatapi.com/api/images/get?format=xml&results_per_page=1", true);
        catGetter.send();
      }


      //Learning jquery stuff
    /*  $.get('http://netflixroulette.net/api/api.php?title=Attack%20on%20titan',function(data){

      });
      */
    }

};


function launchDemoApp(parameters){
  addAnother('catapp', "Kitty Cat"); //Sets the title to whoever's name you said
}

function addAnother(href, title) {
    var ul = document.getElementById("applist");
    var li = document.createElement("li");

    var wrapper = document.getElementById("wrapper");

    var page = document.createElement("section");
    page.setAttribute("id",href);
    page.setAttribute("class","wrapper style1 fullscreen");
    var inner = document.createElement("div");

    var data3 = fs.readFileSync('services/demo/helloWorld/demo_blaise.html');

    inner.innerHTML = data3.toString();
    var childNodes = inner.childNodes;
    console.log(childNodes);
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
       document.getElementById(title).click();

    });

    catGetter.open("GET", "http://thecatapi.com/api/images/get?format=xml&results_per_page=1", true);
    catGetter.send();

}
