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
            res.send('success');
        }
    });
}

