exports = module.exports;



var welcome = require('../models/Welcome');
var mongo = require('mongodb');

exports.sayHello = function(req, res) {

  var name = req.param('name', '');

  var context = {
    site_title: "Node.js Bootstrap Demo Page"
  , welcome_message: welcome.welcomeMessage()
  }

  var template = '../lib/movietime/views/movietime';
  res.render(template, context);

  var MONGOHQ_URL="mongodb://chandra:6d5912a65194479534d7e78c2a478299@paulo.mongohq.com:10079/app17992070";

    var collections = ["userinfo"];
    var db = require("mongojs").connect(MONGOHQ_URL, collections);
    db.userinfo.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
        if( err || !saved ) {
            console.log('User not saved');
            console.log(err);
            console.log(saved);
        } else {
            console.log('user saved!');
        }
    });


};

