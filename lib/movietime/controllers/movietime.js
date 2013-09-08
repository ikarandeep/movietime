exports = module.exports;



var welcome = require('../models/Welcome');
var mongo = require('mongodb');
var http = require('http');

exports.sayHello = function(req, res) {

  var name = req.param('name', '');

  var context = {
    site_title: "Node.js Bootstrap Demo Page"
  , welcome_message: welcome.welcomeMessage()
  }

  var template = '../lib/movietime/views/movietime';
  res.render(template, context);

};

exports.saveUserInfo = function(req, res) {
    var email = req.param('email');
    var phone = req.param('phone');
    var interests = req.param('interests');
    console.log(email);
    console.log(phone);
    console.log(interests);

    var MONGOHQ_URL="mongodb://chandra:test@paulo.mongohq.com:10079/app17992070";

    var collections = ["userinfo"];
    var db = require("mongojs").connect(MONGOHQ_URL, collections);
    db.userinfo.save({email: email, phone: phone, interests: interests}, function(err, saved) {
        if( err || !saved ) {
            console.log('User not saved');
            console.log(err);
            console.log(saved);
        } else {
            console.log('user saved!');
            sendText(phone, "Your account is active now");
            res.send('success');
        }
    });
}

var sendText = function(number, msg) {
    var accountSid = 'AC7ffda848c8d91d2f5bd54c2bf65eed21';
    var authToken = "1b48a4376221c9a8419dd640d88f4030";
    var client = require('twilio')(accountSid, authToken);

    client.sms.messages.create({
        body: msg,
        to: number,
        from: "+12706813955"
    }, function(err, message) {
        console.log(message.sid);
    });
}    
exports.runCron = function(req, res) {
	// get the data from rotten tomatos

	var API_KEY = "h6cvqp2gxzr6he9r6m8k2pjw";
	var COUNTRY = "us";
	var LIMIT = "16";

	var optionsget = {
	  host: 'api.rottentomatoes.com',
	  path: 'api/public/v1.0/lists/movies/opening.json?limit=' + LIMIT + '&country=' + COUNTRY + '&apikey=' + API_KEY
    //host: 'google.com',

  };

 
console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');
 
// do the GET request
var req = http.request(optionsget, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  //res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();


}
