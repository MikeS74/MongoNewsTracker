var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var ObjectID = require("mongodb").ObjectID;
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static("public"));
//var databaseUrl = "newstrackerdb";
//var collections = ["newstrackerdata"];
//var db = mongojs(databaseUrl, collections);
var db = mongojs('admin:freshchoice1@ds213338.mlab.com:13338/heroku_wkx8w430', ['newstrackerdata']);
db.on("error", function(error) {
    console.log("Database Error:", error);
});
require("./routing/apiRoutes")(app);
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/all", function(req, res) {
    db.newstrackerdata.find({}, function(error, found) {
        if (error) {
            console.log(error);
        } else {
            res.json(found);
        }
    });
});
var tempScraped = require("./data/tempScraped");
app.get("/scrape", function(req, res) {
    request("https://www.nytimes.com/section/us", function(error, response, html) {
        var $ = cheerio.load(html);
        var results = [];
        $("h2.headline").each(function(i, element) {
            var title = $(element).text().trim();
            var summary = $(element).siblings('.summary').text().trim();
            var link = $(element).children().attr("href");
            if (link === undefined) {
                link = $(element).closest("a").attr("href");
            }
            var newScrapeObj = {
                title: title,
                summary: summary,
                link: link
            }
            tempScraped.push(newScrapeObj);
        });
    });
    res.send("Scrape Complete");
});
app.post("/dbArtSave", function(data) {
    title2 = data.body.saveTitle;
    summary2 = data.body.saveSum;
    link2 = data.body.saveLink;
    db.newstrackerdata.update({
        title: title2
    }, {
        $set: {
            title: title2,
            summary: summary2,
            link: link2
        }
    }, {
        upsert: true
    }, function(err, inserted) {
        if (err) {
            console.log(err);
        } else {
            console.log(inserted);
        }
    });
});
app.post("/notepost", function(data) {
    var idInsert = data.body.newNoteID;
    var noteInsert = data.body.currentNote;
    db.newstrackerdata.update({
        _id: ObjectID(idInsert)
    }, {
        $push: {
            notes: noteInsert
        }
    }, function(err, inserted) {
        if (err) {
            console.log(err);
        } else {
            console.log(inserted);
        }
    });
});
app.post("/notedel", function(data) {
    var xID = data.body.xID;
    var noteText = data.body.noteText;
    var textArray = [];
    textArray.push(noteText);
    console.log(textArray);
    db.newstrackerdata.update({
        _id: ObjectID(xID)
    }, {
        $pull: {
            notes: {
                $in: textArray
            }
        }
    }, function(err, inserted) {
        if (err) {
            console.log(err);
        } else {
            console.log(inserted);
        }
    });
});
app.post("/delart", function(data) {
    var delIDString = data.body.newNoteID;
    console.log(delIDString);
    db.newstrackerdata.remove({
        _id: ObjectID(delIDString)
    }, function(err, deleted) {
        if (err) {
            console.log(err);
        } else {
            console.log(deleted);
        }
    });
});
app.listen(3000, function() {
    console.log("App running on port 3000!");
});