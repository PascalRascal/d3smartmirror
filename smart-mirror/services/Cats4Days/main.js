var catAppActive = false;

var catGetter = new XMLHttpRequest();
catGetter.onreadystatechange = function() {
  if (catGetter.readyState == 4 && catGetter.status == 200) {
      //First part finds the img tag for the catapp, second part sets the source to the cat image requested
      document.getElementById("catapp").firstElementChild.children[1].setAttribute("src", catGetter.responseXML.getElementsByTagName("url")[0].innerHTML);
  }
};

catGetter.open("GET", "http://thecatapi.com/api/images/get?format=xml&results_per_page=1", true);
catGetter.send();
