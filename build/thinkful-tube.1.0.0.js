/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var API_KEY = 'AIzaSyDQ6iEJPREVbNl-z1krbf3eNIjCATu5aBk';
	var ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
	var MAX_RESULTS = 12 * 4;
	var nextPage;
	var lastQuery;
	
	function YouTubeVideo(videoId, channelId, title, desc, thumbLink) {
	  this.videoId = videoId;
	  this.channelId = channelId;
	  this.title = title;
	  this.desc = desc;
	  this.thumbLink = thumbLink;
	}
	
	YouTubeVideo.prototype.renderHTML = function renderHTML() {
	  var html = '<article class="col-3">' +
	    '<a href="#" class="js-video-link" id="' + this.videoId + '">' +
	    '<div class="tile-container__tile-wrapper" style="background-image: url(\'' + this.thumbLink + '\')">' +
	      '<div class="tile-container__tile-footer">' +
	        '<h1 class="tile-container__tile-title">' + this.title + '</h1>' +
	        '<p class="tile-container__tile-desc">' + this.desc + '</p>' +
	        '<div class="tile-container__channel-icon"></div>' +
	      '</div>' +
	    '</div>' +
	    '</a>' +
	    '</article>';
	  return html;
	};
	
	function SearchResult(videos, nextPageToken) {
	  this.videos = videos;
	  this.nextPageToken = nextPageToken;
	}
	
	function handleListResponse(searchResult) {
	  nextPage = searchResult.nextPageToken || null;
	  var html = '<div class="row">';
	  for (var i = 0; i < searchResult.videos.length; i++) {
	    html += searchResult.videos[i].renderHTML();
	    if ((i + 1) % 4 === 0) {
	      html += '</div><div class="row">';
	    }
	  }
	  html += '</div>';
	
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
	    q.q = lastQuery;
	  } else {
	    $('#js-container').empty();
	  }
	  lastQuery = q.q;
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
	  $('#js-search-query').val('');
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
	  var lightbox = $('#js-lightbox');
	  $('#js-search-form').submit(startSearch);
	  $('#js-container').on('click', '.js-next-page', getMoreResults);
	  $('#js-search-query').focus(function() {
	    $('#js-search-form').toggleClass('header-search__form_expanded');
	  });
	  $('#js-search-query').blur(function() {
	    $('#js-search-form').toggleClass('header-search__form_expanded');
	  });
	  $('#js-container').on('click', '.js-video-link', function(event) {
	    event.preventDefault();
	    var id = $(this).attr('id');
	    var html = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';
	    lightbox.append(html);
	    lightbox.toggleClass('lightbox_visible');
	  });
	  lightbox.click('#js-lightbox-dismiss', function(event) {
	    event.preventDefault();
	    lightbox.toggleClass('lightbox_visible');
	    lightbox.empty();
	  });
	  $(window).on('scroll', function() {
	    if ($(window).scrollTop() + $(window).height() === $(document).height()) {
	      if (nextPage) {
	        submitSearch(nextPage);
	      }
	    }
	  });
	  submitSearch();
	});


/***/ }
/******/ ]);
//# sourceMappingURL=thinkful-tube.1.0.0.js.map