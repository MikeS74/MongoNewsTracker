# Mongo News Tracker

https://fathomless-lowlands-94636.herokuapp.com/

Grab the top news articles of the day with the 'Scrape Articles' button. Then save the ones you want and add personalized notes.

## Requirements
- Scrape stories from a news outlet of your choice
- Save each scraped article to your application
- Users should be able to leave comments on the articles displayed and revisit them later
- Users should also be able to delete comments left on articles

## Technologies Used
- NodeJS and Express Routing
- Mongo Database
- Cheerio for web scraping
- AJAX and JSON
- JQuery, CSS and HTML
- Heroku and MLab

## Code Explaination
Cheerio performs a web scrape of 'nytimes.com/section/us' and pushes the results to an empty array through the custom API module. Objects from that array are used to display temporarily so the user can decide which article to save. Express routes then connect to MongoDB and send/receive AJAX data to/from JQuery & JavaScript functions triggered by the user. A CSS modal is used to display notes associated with the Mongo ObjectID of the saved article. That same ID is also used to delete those notes or submit a new one through AJAX.
