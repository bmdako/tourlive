/*******************************************************************************
Copyright (c) 2014, Berlingske Media A/S
All rights reserved.
*******************************************************************************/

var eventStarted = isToday(firstDayOfEvent) || firstDayOfEvent < Date.now();

function start() {

  // Fetching the feed once (without animations) before everyting sets in motion.
  getFeedData(false);

  // Adding CSS class to our progress bar element.
  // This binds the CSS animation, but also the event-listener that triggers the feed reload.
  var e = document.getElementById("reload-progress-bar");
  e.addEventListener("animationIteration", progressEvent, false);
  e.addEventListener("webkitAnimationIteration", progressEvent, false);
  e.addEventListener("mozAnimationIteration", progressEvent, false);
  e.className = "progress-bar";
}

// This function is called for every animation iteration. It reloads the feed.
function progressEvent (e) {
  getFeedData(true);
}

function getFeedData( showAnimation ) {
  $.get(feedUrl, function (data) {

    var items = $(data).find('item').toArray().reverse();

    if (eventStarted) {

      var itemsFromToday = items.filter(fromToday),
          itemsFromYesterday = items.filter(fromYesterday);

      if (itemsFromToday.length > 0) {

        if (showAnimation) {
          $(itemsFromToday).each(insertItemWithAnimation);
        } else {
          $(itemsFromToday).each(insertItemWithoutAnimation);
        }

        $('.event-not-started').hide();
        $('.event-not-live').hide();
        $('.event-live').show();

      } else {
        
        $(itemsFromYesterday).each(insertItemWithoutAnimation);
       
        $('.event-not-started').hide();
        $('.event-not-live').show();
        $('.event-live').hide();
      }

    } else {
      
      $('.event-not-started').show();
      $('.event-not-live').hide();
      $('.event-live').hide();
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

function insertItemWithAnimation (index, item) {
  prependItem(item, true);
}

function insertItemWithoutAnimation (index, item) {
  prependItem(item, false);
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
  if ($('.feed-items').find('#' + id).length == 0) {
    $('.feed-items').prepend(
      $('<div id="' + id + '" class="feed-item">' +
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

function getQueryParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  //return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  return results === null ? '' : decodeURIComponent(results[1].replace(/\/+/g, ''));
}