/**
 * @author - Chandra Bhavanasi
 */
 var databaseUrl = "mongdb://movietimeuser:f9c2789f43bbbbd764dd73320a7e9dc5@paulo.mongohq.com:10079/app17992070"
 var collections = ["users"]
 var db = require("mongojs").connect(databaseUrl, collections);

function Welcome() {};

Welcome.prototype.welcomeMessage = function() {
    return 'This should probably work!'
}

module.exports = new Welcome;


db.users.save({email: "ikarandeep@gmail.com", interests: "comedy,drama,technology"}, function(err, saved){
	if( err || !saved ) console.log("User not saved");
	else console.log("user saved");
});