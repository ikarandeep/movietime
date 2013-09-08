exports = module.exports;

//var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var databaseUrl = "movietimeuser:f9c2789f43bbbbd764dd73320a7e9dc5@paulo.mongohq.com:10079/app17992070"
var collections = ["users"]
var db = require("mongojs").connect(databaseUrl, collections);

db.users.save({email: "ikarandeep@gmail.com", interests: "comedy,drama,technology"}, function(err, saved){
	if( err || !saved ) console.log("User not saved");
	else console.log("user saved");
});

var welcome = require('../models/Welcome');

exports.sayHello = function(req, res) {

  var name = req.param('name', '');

  var context = {
    site_title: "Node.js Bootstrap Demo Page"
  , welcome_message: welcome.welcomeMessage()
  }

  var template = '../lib/movietime/views/movietime';
  res.render(template, context);

};