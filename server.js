var express = require("express");
// var mongodb = require("mongodb");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var ObjectID = require("mongodb").ObjectID;
var app = express();
var bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));

//Local Mongo setup==========================
//var databaseUrl = "newstrackerdb";
//var collections = ["newstrackerdata"];
//var db = mongojs(databaseUrl, collections);
//===========================================

//Remote Mongo setup
var db = mongojs(
  "mongodb+srv://nytNewsTracker:<password>@newstracker01.j33ws.mongodb.net/heroku_wkx8w430?retryWrites=true&w=majority",
  ["newstrackerdata"]
);
db.on("connect", function () {
  console.log("database connected");
});
db.on("error", function (error) {
  console.log("Database Error:", error);
});

require("./routing/apiRoutes")(app);

//Home page route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Retrieve all Mongo collection data
app.get("/all", function (req, res) {
  db.newstrackerdata.find({}, function (error, found) {
    if (error) {
      console.log(error);
    } else {
      res.json(found);
    }
  });
});

//Cheerio scrape of New York Times then push to API route
var tempScraped = require("./data/tempScraped");
app.get("/scrape", function (req, res) {
  request("https://www.nytimes.com/section/us", function (
    error,
    response,
    html
  ) {
    var $ = cheerio.load(html);
    var results = [];
    $("h2").each(function (i, element) {
      var title = $(element).text().trim();
      var summary = $(element).siblings("p").text().trim();
      var link = $(element).children().attr("href");
      if (link === undefined) {
        link = $(element).closest("a").attr("href");
      }

      var nytLink = "https://www.nytimes.com" + link;
      var newScrapeObj = {
        title: title,
        summary: summary,
        link: nytLink,
      };
      tempScraped.push(newScrapeObj);
    });
  });
  res.send("Scrape Complete");
});

//Save an article to the database from the front-end
app.post("/dbArtSave", function (data) {
  title2 = data.body.saveTitle;
  summary2 = data.body.saveSum;
  link2 = data.body.saveLink;
  db.newstrackerdata.update(
    {
      title: title2,
    },
    {
      $set: {
        title: title2,
        summary: summary2,
        link: link2,
      },
    },
    {
      upsert: true,
    },
    function (err, inserted) {
      if (err) {
        console.log(err);
      } else {
        console.log(inserted);
      }
    }
  );
});

//Save a note for articles already saved in database
app.post("/notepost", function (data) {
  var idInsert = data.body.newNoteID;
  var noteInsert = data.body.currentNote;
  db.newstrackerdata.update(
    {
      _id: ObjectID(idInsert),
    },
    {
      $push: {
        notes: noteInsert,
      },
    },
    function (err, inserted) {
      if (err) {
        console.log(err);
      } else {
        console.log(inserted);
      }
    }
  );
});

//Delete notes that correspond to articles already saved in database
app.post("/notedel", function (data) {
  var xID = data.body.xID;
  var noteText = data.body.noteText;
  var textArray = [];
  textArray.push(noteText);
  db.newstrackerdata.update(
    {
      _id: ObjectID(xID),
    },
    {
      $pull: {
        notes: {
          $in: textArray,
        },
      },
    },
    function (err, inserted) {
      if (err) {
        console.log(err);
      } else {
        console.log(inserted);
      }
    }
  );
});

//Delete articles already saved in database
app.post("/delart", function (data) {
  var delIDString = data.body.newNoteID;
  db.newstrackerdata.remove(
    {
      _id: ObjectID(delIDString),
    },
    function (err, deleted) {
      if (err) {
        console.log(err);
      } else {
        console.log(deleted);
      }
    }
  );
});

var PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
