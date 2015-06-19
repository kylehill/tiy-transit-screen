var latitude, longitude
var templates
var interval

var compileTemplates = function() {
  templates = {
    metro: Handlebars.compile( $("#metroTemplate").html() ),
    bikeshare: Handlebars.compile( $("#bikeshareTemplate").html() )
  }
}

var setCoordinates = function(position) {
  latitude = position.coords.latitude
  longitude = position.coords.longitude
}

var displayData = function(data) {

  $(".container").empty()

  var count = {
    bikeshare: 0,
    metro: 0
  }

  _.each(data.locations, function(location){
    switch(location.type) {
      case "bikeshare":
        if (count.bikeshare >= 6) {
          return
        }
        count.bikeshare++
        return displayBikeshare(location)
      case "metro":
        if (count.metro >= 3) {
          return
        }
        count.metro++
        return displayMetro(location)
    }
  })

}

var displayMetro = function(station) {

  $(".container").append(templates.metro(station))

}

var displayBikeshare = function(station) {

  var data = {
    name: station.name,
    bikes: station.num_bikes,
    docks: station.num_empty_docks,
    width: (station.num_bikes / (station.num_bikes + station.num_empty_docks)) * 100
  }

  $(".container").append(templates.bikeshare(data))

}

var getLocationData = function(callback) {
  navigator.geolocation.getCurrentPosition(callback)
}

var getThatSweetAjaxData = function(callback) {

  $.ajax({
    url: "/data",
    method: "GET",
    data: {
      latitude: latitude,
      longitude: longitude
    },
    success: callback
  })

}

$(document).on("ready", function(){

  compileTemplates()

  getLocationData(function(position){

    setCoordinates(position)

    getThatSweetAjaxData(function(data){

      displayData(data)

      interval = setInterval(function(){

        getThatSweetAjaxData(displayData)

      }, 60000)

    })

  })

})