var API_KEY = 'AIzaSyDQ6iEJPREVbNl-z1krbf3eNIjCATu5aBk';
var ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
var MAX_RESULTS = 12 * 4;
var nextPage;

function YouTubeVideo(videoId, channelId, title, desc, thumbLink) {
  this.videoId = videoId;
  this.channelId = channelId;
  this.title = title;
  this.desc = desc;
  this.thumbLink = thumbLink;
}

YouTubeVideo.prototype.renderHTML = function renderHTML() {
  var html = '<article class="col-3">' +
    '<div class="tile-container__tile-wrapper">' +
      '<img class="tile-container__tile-thumbnail" src="' + this.thumbLink + '">' +
      '<div class="tile-container__tile-footer">' +
        '<h1 class="tile-container__tile-title">' + this.title + '</h1>' +
        '<p class="tile-container__tile-desc">' + this.desc + '</p>' +
      '</div>' +
    '</div>' +
    '</article>';
  return html;
};

function SearchResult(videos, nextPageToken) {
  this.videos = videos;
  this.nextPageToken = nextPageToken;
}

function handleListResponse(searchResult) {
  $('.js-next-page').remove();

  nextPage = searchResult.nextPageToken || null;
  var html = '<div class="row">';
  for (var i = 0; i < searchResult.videos.length; i++) {
    html += searchResult.videos[i].renderHTML();
    if ((i + 1) % 4 === 0) {
      html += '</div><div class="row">';
    }
  }
  html += '</div>';

  if (nextPage) {
    html += '<div class="row"><div class="col-12"><a href="#" class="next-page js-next-page">More</a></div></div>';
  }

  $('#js-container').append(html);
  $('#js-search-form').children().prop('disabled', false);
}

function submitSearch(page) {
  $('#js-search-form').children().prop('disabled', true);
  var q = {
    key: API_KEY,
    part: 'snippet',
    q: $('#js-search-query').val(),
    type: 'video',
    maxResults: MAX_RESULTS
  };
  if (page) {
    q.pageToken = page;
  } else {
    $('#js-container').empty();
  }
  $.getJSON(ENDPOINT, q, function createSearchResult(data) {
    var videos = data.items.map(function createVideoElement(item) {
      return new YouTubeVideo(
        item.id.videoId,
        item.snippet.channelId,
        item.snippet.title,
        item.snippet.description,
        item.snippet.thumbnails.medium.url);
    });
    handleListResponse(new SearchResult(videos, data.nextPageToken));
  });
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
  $('#js-container').on('click', '.js-next-page', getMoreResults);
});
