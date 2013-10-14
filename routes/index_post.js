var request = require("request");
var db = require("../src/db");

var whereURL = 'http://query.yahooapis.com/v1/public/yql?format=json&q=select * from geo.placefinder where gflags="R" and text=" {LAT}, {LON} "';

var revgeo = function(lat, lon, callback) {
  var url = whereURL.replace("{LAT}", lat).replace("{LON}", lon);

  request(url, function(error, response, contentBody) {
    var address;
    try {
      address = JSON.parse(contentBody).query.results.Result;
      address = Array.isArray(address) ? address[0] : address;
      address = address.line1 + " " + address.line2;
    }
    catch(e) {
      callback("Could not retreive the location at "+lat+", "+lon);
      return;
   }

   if (error || response.statusCode != 200) {
     callback("Error contacting the reverse geocoding service.");
   }
   else {
    db.Breadcrumb.create([
                {
                    date: new Date(),
                    latitude: lat,
                    longitude: lon,
                    address: address
                }
            ], function (err, items) {
                // err - description of the error or null
                // items - array of inserted items
                // Pass back both err and address at this point.
                callback(err, address);
            });
    }
  });
};

module.exports = function(req, res) {
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  revgeo(latitude, longitude, function(err, address) {
    console.log(latitude, longitude, err, address);

    res.render('home', {
      error: err,
      location: {
        latitude: latitude,
        longitude: longitude,
        address: address
      }
    });
  });
};