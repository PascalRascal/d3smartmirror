
navigator.geolocation.getCurrentPosition(send_position);

function send_position(position){
  var mWeatherRequest = new XMLHttpRequest();

  mWeatherRequest.onreadystatechange = function(){
    if (mWeatherRequest.readyState == 4 && mWeatherRequest.status == 200){

      var weatherResults = JSON.parse(mWeatherRequest.responseText);
      //If the result is an array, then it is a search query and we should treat it as such, otherwise it is an actual weather object
      if (weatherResults[0]){
        var weatherLocationURL = 'https://www.metaweather.com/api/location/' + weatherResults[0].woeid;
        mWeatherRequest.open("GET", weatherLocationURL, true);
        mWeatherRequest.send();
      }else{
        //Todays weather will be the first object in the array
        console.log(weatherResults);
        var todaysWeather = weatherResults.consolidated_weather[0];

        var todaysWeatherPic = "https://www.metaweather.com/static/img/weather/png/" + todaysWeather.weather_state_abbr + ".png";

        document.getElementById("dailyWeatherPicture").setAttribute("src", todaysWeatherPic);
        todayTemp = todaysWeather.the_temp;
        todayTemp = (todayTemp * 1.8 + 32).toPrecision(3); //Converst from celsisus to degrees
        document.getElementById("weatherTemp").innerHTML = todayTemp + " °F";
      }
    }
  }

  var lat = position.coords.latitude;
  var longi = position.coords.longitude;
  //Searches through the api with our latitude and longitude
  var searchURL = 'https://www.metaweather.com/api/location/search/?lattlong=' + lat + ',' + longi;
  mWeatherRequest.open("GET", searchURL, true);
  mWeatherRequest.send();
}
