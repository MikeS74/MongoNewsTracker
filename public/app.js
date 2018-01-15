// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'newstrackerdata' (JSON) and creates a table body
function displayResults(newstrackerdata) {
    // First, empty the table
    //  $("tbody").empty();

    // Then, for each entry of that json...
    newstrackerdata.forEach(function (newsdata) {

        var listDiv = $("<div class='list-gen'>");

        var dispAll = '<a href="' + newsdata.link + '" style="color: black; text-decoration: none"><p>' + newsdata.title + '</p>' + '<p>' + newsdata.summary + '</p></a><input type="button" value="ARTICLE NOTES" class="myBtn" data-mongo-id="' + newsdata._id + '">' +
            '<input type="button" value="DELETE ARTICLE" id="del-art">';

        listDiv.append(dispAll);
        $("#list-view").append(listDiv);

        //      $("tbody").append("<tr><td>" + newsdata.title + "</td>" +
        //                         "<td>" + newsdata.summary + "</td>" +
        //                         "<td>" + newsdata.link + "</td>");
    });
}

// Bonus function to change "active" header
//function setActive(selector) {
//  $("th").removeClass("active");
//  $(selector).addClass("active");
//}

// 1: On Load
// ==========

// First thing: ask the back end for json with all newstrackerdata
$.getJSON("/all", function (data) {
    // Call our function to generate a table body
    displayResults(data);
});

///////////////////////////////////////////////////////////////////////////////////////

$(".modal-content").on("click", ".noteSubmit", function () {
    var currentNote = $("#note").val().trim();
    console.log(currentNote);
        var newNoteID = $(this).attr("data-mongo-id");
    $.getJSON("/notepost", function() {

    });
});
///////////////////////////////////////////////////////////////////////////////////////

// 2: Button Interactions
// ======================

// When user clicks the weight sort button, display table sorted by weight
