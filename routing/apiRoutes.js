var tempScraped = require("../data/tempScraped");

module.exports = function(app) {
    
        app.get("/api/tempScraped", function(req, res) {
        res.json(tempScraped);
    });

        app.post("/api/tempScraped", function(req, res) {
        "use strict";
        var scrapeInfo = req.body;
        console.log(scrapeInfo);
        tempScraped.push(scrapeInfo);
    });
};
    