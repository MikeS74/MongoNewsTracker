 var currentURL = window.location.origin;
 $("#scrape-btn").click(function() {
     $(".list-gen").remove();
     $("#no-art").hide();
     $.ajax({
         url: "/scrape",
         type: 'GET'
     }) 
     setTimeout(function() {
         $.get("/api/tempScraped", function(data) {
             for (var i = 0; i < data.length; i++) {
                 var freshScrape = data[i];
                 var listDiv = $("<div class='scrape-list-gen'>");
                 var dispScrape = '<a id="scrape-link" href="' + freshScrape.link + '" style="text-decoration: none" target="new"><p id="scrape-title">' + freshScrape.title + '</p><hr>' + '<p id="scrape-sum">' + freshScrape.summary + '</p><div class="side-options"></a><a class="save-art"><i class="material-icons">add</i>SAVE ARTICLE</a></div>';
                 listDiv.append(dispScrape);
                 $("#list-view").append(listDiv);
             }
             $(".save-art").click(function() {
                 $(this).html('<i class="material-icons">done</i>SAVED!');
                 var saveLink = $(this).closest(".scrape-list-gen").find("a").attr("href");
                 var saveTitle = $(this).closest(".scrape-list-gen").find("#scrape-title").text();
                 var saveSum = $(this).closest(".scrape-list-gen").find("#scrape-sum").text();
                 var saveArtObj = {
                     saveLink: saveLink,
                     saveTitle: saveTitle,
                     saveSum: saveSum
                 }
                 $.ajax({
                     dataType: "json",
                     url: "/dbArtSave",
                     data: saveArtObj,
                     type: "POST"
                 })
             });
         });
     }, 500);
 });

 function displayResults(newstrackerdata) {
     newstrackerdata.forEach(function(newsdata) {
         var listDiv = $("<div class='list-gen'>");
         var dispAll = '<a href="' + newsdata.link + '" style="text-decoration: none" target="new"><p id="scrape-title">' + newsdata.title + '</p><hr>' + '<p id="scrape-sum">' + newsdata.summary + '</p></a><div class="side-options"><a class="myBtn" data-mongo-id="' + newsdata._id + '"><i class="material-icons">sort</i>ARTICLE NOTES</a><br><br>' + '<a class="del-art" data-mongo-id="' + newsdata._id + '"><i class="material-icons">clear</i>DELETE ARTICLE</a></div>';
         listDiv.append(dispAll);
         $("#list-view").prepend(listDiv);
     });
     if ($(".list-gen").length === 0) {
         $('.no-art').text("Looks you don't have any articles saved.");
         $("#no-art").show();
     }
 }
 $("#saved-art-btn").on("click", function() {
     $('#list-view').load(document.URL + ' #list-view');
     artNotesBtn();
     $.ajax({
         dataType: "json",
         url: "/all",
         method: "GET"
     }).done(function(data) {
         displayResults(data);
     });
     $(".scrape-list-gen").remove();
     $("#no-art").hide();
 });
 var modal = document.getElementById('myModal');
 $(".modal-content").on("click", ".noteSubmit", function() {
     var currentNote = $("#note").val().trim();
     var newNoteID = $(this).attr("data-mongo-id");
     var newNoteObj = {
         newNoteID: newNoteID,
         currentNote: currentNote
     }
     $.ajax({
         url: "/notepost",
         data: newNoteObj,
         type: "POST"
     }) 
     modal.style.display = "none";
     $("#thisTitle").text(" ");
 });
 $(".modal-content").on("click", ".x", function() {
     var xID = $(this).attr("data-mongo-id");
     var noteText = $(this).siblings("p").text();
     $(this).parent(".notes-from-mongo2").remove();
     var delNoteObj = {
         xID: xID,
         noteText: noteText
     }
     $.ajax({
         url: "/notedel",
         data: delNoteObj,
         type: "POST"
     })
 });