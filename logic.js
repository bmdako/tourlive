/*******************************************************************************
Copyright (c) 2014, Berlingske Media A/S
All rights reserved.
*******************************************************************************/

function start () {

  // Fetching the feed once (without animations) before everyting sets in motion.
  getFeedData(function (items) {
    logic(items, false);
  });

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
  getFeedData(function (items) {
    logic(items, true);
  });
}

function getFeedData (callback) {
  $.get(feedUrl, function (data) {
    var items = $(data).find('item').toArray().reverse();
    callback(items);
  });
}

function logic (items, showAnimation) {

  var eventStarted = dateEquals(firstDayOfEvent, new Date()) || firstDayOfEvent < Date.now();

  var itemsFromToday = items.filter(fromToday),
      //itemsFromYesterday = items.filter(fromYesterday),
      itemsFromEarlierInEvent = items.filter(fromEarlierInEvent);

  // If event is started and there's items from today, we're live from the event.
  if (eventStarted && itemsFromToday.length > 0) {

    if (showAnimation) {
      $(itemsFromToday).each(insertItemWithAnimation);
    } else {
      $(itemsFromToday).each(insertItemWithoutAnimation);
    }

    $('.event-not-started').hide();
    $('.event-not-live').hide();
    $('.event-live').show();

  // Else, if event is started and there's from earlier in the event, we'll show the previous items.
  } else if (eventStarted && itemsFromEarlierInEvent.length > 0) {
      
    $(itemsFromEarlierInEvent).each(insertItemWithoutAnimation);
   
    $('.event-not-started').hide();
    $('.event-not-live').show();
    $('.event-live').hide();

  // Else, the event is not yet started so we'll show nothing.
  } else {
    
    $('.event-not-started').show();
    $('.event-not-live').hide();
    $('.event-live').hide();
  }
}

function fromToday (item) {
  var pubDate = getPubDate(item);
  return dateEquals(pubDate, new Date());
}

function fromYesterday (item) {
  var pubDate = getPubDate(item);
  var now = new Date();
  now.setDate(now.getDate() - 1);
  return dateEquals(pubDate, now);
}

function fromEarlierInEvent (item) {
  var pubDate = getPubDate(item);
  return !dateEquals(pubDate, new Date()) && pubDate > firstDayOfEvent;
}

function getPubDate (item) {
  return new Date($(item).find('pubDate').text().replace(' CEST', ''));
}

function dateEquals (date1, date2) {
  if (date2 === undefined) date2 = new Date();
  return date1.getYear() === date2.getYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

function insertItemWithAnimation (index, item) {
  prependItem(item, true);
}

function insertItemWithoutAnimation (index, item) {
  prependItem(item, false);
}

function formatDate (date) {
   return date.getDate() + '.' + (date.getMonth() + 1) + '. ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
}

function prependItem (item, showAnimation) {
  var title = $(item).find('title').text(),
      description = $(item).find('description').text(),
      pubDate = new Date($(item).find('pubDate').text().replace(' CEST', '')),
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

function getQueryParameterByName (name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  //return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  return results === null ? '' : decodeURIComponent(results[1].replace(/\/+/g, ''));
}