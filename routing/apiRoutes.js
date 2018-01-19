//Variable for friend array data exports
var friends = require("../data/friends");
var tempScraped = require("../data/tempScraped");
var saveArticle = require("../data/saveArticle");
var deleteArticle = require("../data/deleteArticle");

module.exports = function(app) {

//Link to display friend array data converted to json
    app.get("/api/friends", function(req, res) {
        res.json(friends);
    });
    
        app.get("/api/tempScraped", function(req, res) {
        res.json(tempScraped);
    });
    
            app.get("/api/saveArticle", function(req, res) {
        res.json(saveArticle);
    });
                app.get("/api/deleteArticle", function(req, res) {
        res.json(deleteArticle);
    });
 
    app.post("/api/friends", function(req, res) {
        "use strict";
        var userInfo = req.body;
        console.log(userInfo);
        friends.unshift(userInfo);
    });
    
        app.post("/api/tempScraped", function(req, res) {
        "use strict";
        var scrapeInfo = req.body;
        console.log(scrapeInfo);
        tempScraped.push(scrapeInfo);
    });
            app.post("/api/saveArticle", function(req, res) {
        "use strict";
        var saveArtInfo = req.body;
        console.log(saveArtInfo);
        saveArticle.unshift(saveArtInfo);
    });
                app.post("/api/deleteArticle", function(req, res) {
        "use strict";
        var deleteArtInfo = req.body;
        console.log(deleteArtInfo);
        deleteArticle.unshift(deleteArtInfo);
    });
};
    