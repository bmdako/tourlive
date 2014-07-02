function start() {
  getFeedData(); // Fething once before everyting sets in motion.
  var e = document.getElementById("tdf-progress-bar");
  e.addEventListener("animationIteration", getFeedData, false);
  e.addEventListener("webkitAnimationIteration", getFeedData, false);
  e.addEventListener("mozAnimationIteration", getFeedData, false);
  e.className = "progress-bar";
}

/* Before the Tour starts, the page will be a countdown timer.
So we don't need to take care of dates prior the first day of the Tour. */
var firstDayOfTour = new Date(2014,6,5);

function getFeedData (e) {
  //$.get( "http://www.b.dk/helpers/feeds/FeltetLive_rss.xml", function( data ) {
  //$.get( "http://www.feltet.dk/live/FeltetLive_rss.xml", function( data ) {
  $.get('./FeltetLive_rss.xml', displayFeedData);
}

function displayFeedData( data ) {
  var items = $(data).find('item').toArray().reverse(),
      itemsFromToday = items.filter(fromToday);

  if (itemsFromToday.length > 0) {
    $(itemsFromToday).each(prependItem);
    $('.tdf-not-live').hide();
    $('.tdf-live').show();
  } else {
    $('.tdf-not-live' ).show();
    $('.tdf-live').hide();
    if (isToday(firstDayOfTour)) {
      $('.tour-consecutive-days').hide();
    }
    itemsFromYesterday = items.filter(fromYesterday)
    if (itemsFromYesterday.length > 0) {
      $(itemsFromYesterday).each(prependItem);
    }
  }
}

function fromToday(item) {
  var pubDate = new Date($(item).find('pubDate').text());
  //return isToday(pubDate);
  return isToday(pubDate, 6); // <---- TESTING REMOVE!!!! TODO
}

function fromYesterday(item) {
  var pubDate = new Date($(item).find('pubDate').text());
  return isToday(pubDate, 1);
}

function isToday(date, minus) {
  var now = new Date();
  if (minus) now.setDate(now.getDate() - minus);
  return now.getYear() === date.getYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
}

function prependItem (index, item) {
  var title = $(item).find('title').text(),
      description = $(item).find('description').text(),
      pubDate = new Date($(item).find('pubDate').text()),
      pubDateDisplay = pubDate.getDate() + 1 + '.' + pubDate.getMonth() + '. ' + pubDate.getHours() + ':' + pubDate.getMinutes(),
      guid = $(item).find('guid').text(),
      id = guid.substring(guid.indexOf('g=') + 2);

  // Only add if they haven't already been added.
  if ($('.tdf-feed-items').find('#' + id).length === 0) {
    $('.tdf-feed-items').prepend(
      $('<div id="' + id + '" class="tdf-feed-item">' +
        '<div class="header">' +
          '<div class="title">' + title + '</div>' +
          '<div class="pubDate"><img src="./time.png" class="timeicon"/> ' + pubDateDisplay + '</div>' +
        '</div>' +
        '<p class="description">' + description + '</p>' +
      '</div>').hide());
    //$('#'+id).show().css({top: 0, opacity: 0}).animate({top: 50, opacity: 1}, 'slow');
    $('#'+id).slideDown("slow");
  }
}