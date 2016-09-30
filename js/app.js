var API_KEY = "AIzaSyDQ6iEJPREVbNl-z1krbf3eNIjCATu5aBk";
var ENDPOINT = "https://www.googleapis.com/youtube/v3/search";
var MAX_RESULTS = 12 * 4;
var nextPage;
var prevPage;

$(function () {
    $("#js-search-form").submit(startSearch);
    $("#js-next").click(function (event) {
        event.preventDefault();
        submitSearch(nextPage);
    });
    $("#js-previous").click(function (event) {
        event.preventDefault();
        submitSearch(prevPage);
    });
});

function startSearch(event) {
    event.preventDefault();
    submitSearch();
}

function submitSearch(page) {
    $(".js-pagination").prop("disabled", true);
    $("#js-search-form").children().prop("disabled", true);
    $(".js-container").empty();
    var q = {
        key: API_KEY,
        part: "snippet",
        q: $("#js-search-query").val(),
        maxResults: MAX_RESULTS
    };
    if (page) { q.pageToken = page; }
    $.getJSON(ENDPOINT, q, handleListResponse);
}

function handleListResponse(data) {
    nextPage = data.nextPageToken || null;
    prevPage = data.prevPageToken || null;
    var html = '<div class="row">';
    for (var i = 0; i < data.items.length; i++) {
        html += '<div class="col-3"><img src="' +
            data.items[i].snippet.thumbnails.medium.url +
            '"></div>';
        if ((i + 1) % 12 === 0) {
            html += '</div><div class="row">';
        }
    }
    html += '</div>';
    $(".js-container").html(html);
    $("#js-search-form").children().prop("disabled", false);
    $("#js-previous").prop("disabled", !prevPage);
    $("#js-next").prop("disabled", !nextPage);
}