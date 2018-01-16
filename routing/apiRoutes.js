//Variable for friend array data exports
var friends = require("../data/friends");
var tempScraped = require("../data/tempScraped");

module.exports = function(app) {

//Link to display friend array data converted to json
    app.get("/api/friends", function(req, res) {
        res.json(friends);
    });
    
        app.get("/api/tempScraped", function(req, res) {
        res.json(tempScraped);
    });
 
    app.post("/api/friends", function(req, res) {
        "use strict";
        var userInfo = req.body;
        console.log(userInfo);
        friends.unshift(userInfo);
    });
    
        app.post("/api/tempScraped", function(req, res) {
        "use strict";
        var userInfo = req.body;
        console.log(userInfo);
        tempScraped.push(userInfo);
    });
};
    