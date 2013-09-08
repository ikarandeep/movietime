exports = module.exports;

var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var collections = ["users"]
var db = require("mongojs").connect(databaseUrl, collections);

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