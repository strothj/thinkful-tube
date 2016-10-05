var API_KEY = 'AIzaSyDQ6iEJPREVbNl-z1krbf3eNIjCATu5aBk';
var ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
var MAX_RESULTS = 12 * 4;
var nextPage;

function handleListResponse(data) {
  $('.js-next-page').remove();

  nextPage = data.nextPageToken || null;
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

  if (nextPage) {
    html += '<div class="row"><div class="col-12"><a href="#" class="next-page js-next-page">More</a></div></div>';
  }

  $('.js-container').append(html);
  $('#js-search-form').children().prop('disabled', false);
}

function submitSearch(page) {
  $('#js-search-form').children().prop('disabled', true);
  var q = {
    key: API_KEY,
    part: 'snippet',
    q: $('#js-search-query').val(),
    maxResults: MAX_RESULTS
  };
  if (page) {
    q.pageToken = page;
  } else {
    $('.js-container').empty();
  }
  $.getJSON(ENDPOINT, q, handleListResponse);
}

function startSearch(event) {
  event.preventDefault();
  submitSearch();
}

function getMoreResults(event) {
  event.preventDefault();
  submitSearch(nextPage);
}

$(function main() {
  $('#js-search-form').submit(startSearch);
  $('.js-container').on('click', '.js-next-page', getMoreResults);
});
