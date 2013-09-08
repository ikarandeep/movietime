exports = module.exports;



var welcome = require('../models/Welcome');

exports.sayHello = function(req, res) {

  var name = req.param('name', '');

  var context = {
    site_title: "Node.js Bootstrap Demo Page"
  , welcome_message: welcome.welcomeMessage()
  }

  var template = '../lib/movietime/views/movietime';
  res.render(template, context);

var MONGOHQ_URL="mongodb://movietimeuser:f9c2789f43bbbbd764dd73320a7e9dc5@paulo.mongohq.com:10079/app17992070"


};

