     var currentURL = window.location.origin;    
$("#scrape-btn").click(function() {
         $(".list-gen").remove();
    $.ajax({
        url: "/scrape",
        type: 'GET'
    })
                 setTimeout(function(){

$.get("/api/tempScraped", function(data){
    for (var i = 0; i < data.length; i++) {

        var freshScrape = data[i];
//    console.log(freshScrape);
        var listDiv = $("<div class='scrape-list-gen'>");
        var dispScrape = '<a id="scrape-link" href="' + freshScrape.link + '" style="color: black; text-decoration: none"><p id="scrape-title">' + freshScrape.title + '</p>' + '<p id="scrape-sum">' + freshScrape.summary + '</p></a><input type="button" value="SAVE ARTICLE" class="save-art">';
        listDiv.append(dispScrape);
        $("#list-view").append(listDiv);
//               if (i === 19) {
//        break;
//    } 
    }
    $(".save-art").click(function() {
    var saveLink = $(this).closest(".scrape-list-gen").find("a").attr("href");
        var saveTitle = $(this).closest(".scrape-list-gen").find("#scrape-title").text();
        var saveSum = $(this).closest(".scrape-list-gen").find("#scrape-sum").text();
            var saveArtObj = {
                saveLink: saveLink,
                saveTitle: saveTitle,
                saveSum: saveSum
    }
            console.log(saveArtObj);
//            $.post("/api/saveArticle", saveArtObj, function (data) {
//        
//    });
        $.ajax({
            dataType: "json",
        url: "/dbArtSave",
            data: saveArtObj,
        type: "POST"
    })
    });
    });
                     $('.no-art').text(" ");
                     }, 500);
     });





// DISPLAYING SAVED ARTICLES FROM MONGO
function displayResults(newstrackerdata) {
    
    newstrackerdata.forEach(function (newsdata) {
        var listDiv = $("<div class='list-gen'>");
        var dispAll = '<a href="' + newsdata.link + '" style="color: black; text-decoration: none"><p>' + newsdata.title + '</p>' + '<p>' + newsdata.summary + '</p></a><input type="button" value="ARTICLE NOTES" class="myBtn" data-mongo-id="' + newsdata._id + '">' +
            '<input type="button" value="DELETE ARTICLE" class="del-art" data-mongo-id="' + newsdata._id + '">';
        listDiv.append(dispAll);
        $("#list-view").prepend(listDiv);
    });
}

//var dispSaved = '$.getJSON("/all", function (data){displayResults(data);});';
//eval(dispSaved);
$("#saved-art-btn").on("click", function () {
//    $(".list-gen").remove();
$('#list-view').load(document.URL +  ' #list-view');
    artNotesBtn();
//$.get("/all", function (data){
//    displayResults(data);
//});
        $.ajax({ dataType: "json", url: "/all", method: "GET" })
      .done(function(data) {
        displayResults(data);
            console.log(data);
    });
//                $(".list-gen").show();
        $(".scrape-list-gen").remove();
    $('.no-art').text(" ");
    
    });

///////////////////////////////////////////////////////////////////////////////////////
var modal = document.getElementById('myModal');
$(".modal-content").on("click", ".noteSubmit", function () {
    var currentNote = $("#note").val().trim();
    var newNoteID = $(this).attr("data-mongo-id");
    var newNoteObj = {
        newNoteID: newNoteID,
        currentNote: currentNote
    }
 

//    $.post("/api/friends", newNoteObj, function (data) {
//        
//    });   
    console.log(newNoteObj);
    
        $.ajax({
        url: "/notepost",
            data: newNoteObj,
        type: "POST"
    })
    modal.style.display = "none";
});
///////////////////////////////////////////////////////////////////////////////////////
