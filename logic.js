/*******************************************************************************
Copyright (c) 2014, Berlingske Media A/S
All rights reserved.
*******************************************************************************/
var firstDayOfTour = new Date(2014,6,5);
var feedUrl = 'http://www.b.dk/helpers/feeds-getter/bem-wordpress-content.s3.amazonaws.php?file=FeltetLive_rss.xml&mobile=false ';
//var feedUrl = 'http://tourlive.boxen.nu/feed.xml';
//var feedUrl = 'http://www.b.dk/helpers/feeds/FeltetLive_rss.xml';
//var feedUrl = 'http://www.feltet.dk/live/FeltetLive_rss.xml';
//var feedUrl = './FeltetLive_rss.xml';

function start() {
  getFeedData(false); // Fething once before everyting sets in motion.
  var e = document.getElementById("tdf-progress-bar");
  e.addEventListener("animationIteration", progressEvent, false);
  e.addEventListener("webkitAnimationIteration", progressEvent, false);
  e.addEventListener("mozAnimationIteration", progressEvent, false);
  e.className = "progress-bar";
}


function progressEvent (e) {
  getFeedData(true);
}

function getFeedData( showAnimation ) {
  $.get(feedUrl, function (data) {
    var items = $(data).find('item').toArray().reverse(),
        itemsFromToday = items.filter(fromToday);

    if (itemsFromToday.length > 0) {
      if (showAnimation) {
        $(itemsFromToday).each(prependItemWithAnimation);
      } else {
        $(itemsFromToday).each(prependItemWithoutAnimation);
      }

      $('.tdf-not-live').hide();
      $('.tdf-live').show();

    } else {
      var itemsFromYesterday = items.filter(fromYesterday)
      if (itemsFromYesterday.length > 0) {
        $(itemsFromYesterday).each(prependItemWithoutAnimation);
      }
      
      if (isToday(firstDayOfTour) || firstDayOfTour > Date.now()) {
        $('.tour-consecutive-days').hide();
      }

      $('.tdf-not-live' ).show();
      $('.tdf-live').hide();
    }
  });
}

function fromToday(item) {
  var pubDate = new Date($(item).find('pubDate').text().replace(' CEST', ''));
  return isToday(pubDate);
}

function fromYesterday(item) {
  var pubDate = new Date($(item).find('pubDate').text().replace(' CEST', ''));
  return isToday(pubDate, 1);
}

function isToday(date, minus) {
  var now = new Date();
  if (minus) now.setDate(now.getDate() - minus);
  return now.getYear() === date.getYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
}

function prependItemWithAnimation (index, item) {
  prependItem(item, true);
}

function prependItemWithoutAnimation (index, item) {
  prependItem(item, false);
}

function parseItem (item) {
}

function formatDate(date) {
   return date.getDate() + '.' + (date.getMonth() + 1) + '. ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
}

function prependItem (item, showAnimation) {
  var title = $(item).find('title').text(),
      description = $(item).find('description').text(),
      pubDate = new Date($(item).find('pubDate').text().replace(' CEST', '')),
      // pubDateDisplay = pubDate.getDate() + '.' + (pubDate.getMonth() + 1) + '. ' + pubDate.getHours() + ':' + pubDate.getMinutes(),
      pubDateDisplay = formatDate(pubDate),
      guid = $(item).find('guid').text(),
      id = guid.substring(guid.indexOf('g=') + 2);

  // Only add if they haven't already been added.
  if ($('.tdf-feed-items').find('#' + id).length == 0) {
    $('.tdf-feed-items').prepend(
      $('<div id="' + id + '" class="tdf-feed-item">' +
        '<div class="header">' +
          '<div class="title">' + title + '</div>' +
          '<div class="pubDate"><img src="./time.png" class="timeicon"/> ' + pubDateDisplay + '</div>' +
        '</div>' +
        '<div class="description">' + description + '</div>' +
      '</div>').hide());
    if (showAnimation) {
      $('#'+id).slideDown("slow");
    } else {
      $('#'+id).show();
    }
  }
}
