exports = module.exports;



var welcome = require('../models/Welcome');
var mongojs = require('mongojs');

exports.sayHello = function(req, res) {

  var name = req.param('name', '');

  var context = {
    site_title: "Node.js Bootstrap Demo Page"
  , welcome_message: welcome.welcomeMessage()
  }

  var template = '../lib/movietime/views/movietime';
  res.render(template, context);

  var MONGOHQ_URL="mongodb://movietimeuser:f9c2789f43bbbbd764dd73320a7e9dc5@paulo.mongohq.com:10079/app17992070";


    console.log('Trying to connect to the database');
    /*mongo.Db.connect(MONGOHQ_URL, function (err, db) {
        console.log(db)
        console.log('Connected to the databse');
        if (db) {
            db.collection('users', function(er, collection) {
                console.log('trying to insert in the collection');
                collection.insert({'user': 'chandra'}, {safe: true}, function(er,rs) {
                    console.log('Inserted, finally!');
                });
            });
        }
    });*/
    var collections = ["users"];
    var db = mongojs.connect(MONGOHQ_URL, collections);
    db.users.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
        if( err || !saved ) console.log("User not saved");
        else console.log("User saved");
    });


};

