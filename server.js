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

// Main route (simple Hello World Message)
//app.get("/", function(req, res) {
//  res.send("Hello world");
//});

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

      // link = "https://www.nytimes.com/section/us";
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
//      return i<19;
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

////////////////////////////////////////////////////////////////////////////////////////
var idInsert = '5a5c52f821052f496b51206f';
//var mongoIDShell = 'ObjectId("' + idInsert +'")';
app.get("/notepost", function (data) {
    db.newstrackerdata.update({_id: ObjectID(idInsert)}, {$push: {notes: data}},
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
//db.newstrackerdata.update(
//   {_id: idInsert},
//    {$push: {notes: "test note"}});
});
////////////////////////////////////////////////////////////////////////////////////////

app.get("/name", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything,
  // but this time, sort it by name (1 means ascending order)
  db.newstrackerdata.find(function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
