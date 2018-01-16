// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var ObjectID = require("mongodb").ObjectID;

// Initialize Express
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static("public"));
// Database configuration
var databaseUrl = "newstrackerdb";
var collections = ["newstrackerdata"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});

require("./routing/apiRoutes")(app);

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the newstrackerdata collection in the db
  db.newstrackerdata.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
request("https://www.nytimes.com/section/us", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("h2.headline").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).text().trim();
    var summary = $(element).siblings('.summary').text().trim();
    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).children().attr("href");

      if (link === undefined) {

      link = $(element).closest("a").attr("href");
    }

      // If this found element had both a title and a link
      if (title && summary && link) {
        // Insert the data in the newstrackerdata db
db.newstrackerdata.update({
    title: title},
   {title: title,
      summary: summary,
      link: link},
   {upsert: true},
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });
  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

////////////////////////////////////////////////////////////////////////////////////////
//var idInsert = '5a5c52f821052f496b512070';
var friends = require("./data/friends");
var idInsert = "";
var noteInsert = "";
app.put("/notepost", function () {
    idInsert = friends[0].newNoteID;
    noteInsert = friends[0].currentNote;
    db.newstrackerdata.update({_id: ObjectID(idInsert)}, {$push: {notes: noteInsert}},
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
});
////////////////////////////////////////////////////////////////////////////////////////

app.put("/delart", function () {
    idInsert = friends[0].newNoteID;
    db.newstrackerdata.remove({_id: ObjectID(idInsert)}, function(err, deleted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(deleted);
          }
        });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
