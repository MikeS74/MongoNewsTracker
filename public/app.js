// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'newstrackerdata' (JSON) and creates a table body
function displayResults(newstrackerdata) {
    // Then, for each entry of that json...
    newstrackerdata.forEach(function (newsdata) {

        var listDiv = $("<div class='list-gen'>");

        var dispAll = '<a href="' + newsdata.link + '" style="color: black; text-decoration: none"><p>' + newsdata.title + '</p>' + '<p>' + newsdata.summary + '</p></a><input type="button" value="ARTICLE NOTES" class="myBtn" data-mongo-id="' + newsdata._id + '">' +
            '<input type="button" value="DELETE ARTICLE" id="del-art" data-mongo-id="' + newsdata._id + '">';

        listDiv.append(dispAll);
        $("#list-view").append(listDiv);

    });
}

//function displayNotes(newstrackerdata) {
//    newstrackerdata.forEach(function (newsdata) {
//        var savedNotes = [newsdata._id + [newsdata.notes]];
//        console.log(savedNotes);
//        });
//}

// First thing: ask the back end for json with all newstrackerdata
$.getJSON("/all", function (data) {
    // Call our function to generate a table body
    displayResults(data);
//    displayNotes(data);
});

///////////////////////////////////////////////////////////////////////////////////////

$(".modal-content").on("click", ".noteSubmit", function () {
    var currentNote = $("#note").val().trim();
    var newNoteID = $(this).attr("data-mongo-id");
    var newNoteObj = {
        newNoteID: newNoteID,
        currentNote: currentNote
    }
 
    var currentURL = window.location.origin;
    $.post(currentURL + "/api/friends", newNoteObj, function (data) {
        
    });   
    console.log(newNoteObj);
    
    $.ajax({
        url: '/notepost',
        type: 'PUT'
    })
    
});
///////////////////////////////////////////////////////////////////////////////////////
