//Variable for friend array data exports
var friends = require("../data/friends");

module.exports = function(app) {

//Link to display friend array data converted to json
    app.get("/api/friends", function(req, res) {
        res.json(friends);
    });
 
    app.post("/api/friends", function(req, res) {
        "use strict";
        var userInfo = req.body;
        console.log(userInfo);
        friends.unshift(userInfo);
    });
};
    