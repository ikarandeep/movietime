exports = module.exports;



var welcome = require('../models/Welcome');
var mongo = require('mongodb');
var http = require('http');
var mongodb = require('mongojs');
var MONGOHQ_URL="mongodb://chandra:test@paulo.mongohq.com:10079/app17992070";

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

    var collections = ["userinfo"];
    var db = mongodb.connect(MONGOHQ_URL, collections);
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

    console.log(number);
    console.log(msg);

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
	  path: '/api/public/v1.0/lists/movies/opening.json?limit=' + LIMIT + '&country=' + COUNTRY + '&apikey=' + API_KEY,
      headers: {
          'Content-type': 'application/json'
      }
    };

 
    console.info('Options prepared:');
    console.info(optionsget);
    console.info('Do the GET call');

    // do the GET request
    var genreMovieMap = {};
    var req = http.request(optionsget, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      //res.setEncoding('utf8');
      var responseData = '';
      res.on('data', function (chunk) {
        responseData += chunk.toString();
      });
      res.on('end', function() {
        var totalJson = JSON.parse(responseData);
        var movies = totalJson.movies;
        var i = -1;
        var intervalId = setInterval(function() {
            if (i == movies.length-2) {
                clearInterval(intervalId);
                console.log(genreMovieMap);
            }
            i++;
            var movie = movies[i];
            if (movie.id) {
                var movieId = movie.id;
                var movieTitle = movie.title;
                var movieInfoReq = http.request({
                    host: 'api.rottentomatoes.com',
                    path: '/api/public/v1.0/movies/' + movieId + '.json?apikey=' + API_KEY,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }, function(movieInfoRes) {
                    var movieInfo = '';
                    movieInfoRes.on('data', function(movieInfoChunk) {
                        movieInfo += movieInfoChunk.toString();
                    });
                    movieInfoRes.on('end', function() {
                        var movieInfoJson = JSON.parse(movieInfo);
                        var genresForMovie = movieInfoJson.genres;
                        for (var j = 0; j < genresForMovie.length; j++) {
                            var genre = genresForMovie[j];
                            if (genreMovieMap[genre] != undefined) {
                                genreMovieMap[genre].push(movieTitle);
                            } else {
                                genreMovieMap[genre] = [movieTitle];
                            }
                        }
                        if (i == movies.length-1) {
                            //This is after getting info for last movie in the boxOffice request.
                            //Logic to compare user db and sendText goes here.
                            console.log(genreMovieMap);
                            var collections = ["userinfo"];
                            var db = mongodb.connect(MONGOHQ_URL, collections);
                            db.userinfo.find({}, function(err, users) {
                                if (users) {
                                    users.forEach(function(user) {
                                        if (user.interests) {
                                            console.log(user.interests);
                                            var interestsForUser = user.interests.split(',');
                                            var moviesRecommendedForUser = [];
                                            interestsForUser.forEach(function(interest) {
                                                if (genreMovieMap[interest]) {
                                                    var moviesInGenre = genreMovieMap[interest];
                                                    console.log(moviesInGenre);
                                                    moviesInGenre.forEach(function(movieInGenre) {
                                                        if (moviesRecommendedForUser.indexOf(movieInGenre) == -1) {
                                                            moviesRecommendedForUser.push(movieInGenre);
                                                        }
                                                    });
                                                }
                                            });
                                            console.log(moviesRecommendedForUser);
                                            if (moviesRecommendedForUser.length > 0) {
                                                var msg = "Recommended movies for this week are: " + moviesRecommendedForUser.join(', ');
                                                sendText(user.phone, msg.substring(0, 140));
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
                movieInfoReq.write('data\n');
                movieInfoReq.write('data\n');
                movieInfoReq.end();
            }
        }, 1000);
      })
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();


}
