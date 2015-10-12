'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [],
      currentDay;

  function addDay () {
    $.ajax({
      type: 'POST',
      url: '/api/day',
      data: {numDay: days.length},
      success: function(data) {
        var id = data._id;
        days.push({
          hotels: [], //HOTELS
          restaurants: [],
          activities: [],
          id: id
        });
        console.log(data);
        renderDayButtons();
        switchDay(days.length - 1);
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    $.ajax({method: "DELETE", url: '/api/day', data:{dayId: currentDay.id}, success: function() {
      var index = days.indexOf(currentDay);
      days.splice(index, 1);
      switchDay(index);
    }})
  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    if (attraction.type === 'hotels' && currentDay[attraction.type].length === 1) return;
    console.log('current day', currentDay);
    $.ajax({
      type: 'POST',
      url: '/api/' + currentDay.id + '/' + attraction.type + '/' + attraction._id + '/add',
      data: {},
      success: function () {
        currentDay[attraction.type].push(attraction);
        renderDay(currentDay);
        console.log(currentDay);
      },
      error: function (err) {
        console.log(err);
      }
    })
  };

  exports.removeAttraction = function (attraction) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    $.ajax({
      type: 'DELETE',
      url: '/api/' + currentDay.id + '/' + attraction.type + '/' + attraction._id + '/delete',
      success: function() {
        currentDay[attraction.type].splice(index, 1);
        renderDay(currentDay);
      }
    })
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    console.log(day);
    Object.keys(day).forEach(function(type){
      if (type === 'id') return;
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      day[type].forEach(function(attraction){
        $list.append(itineraryHTML(attraction));
        mapModule.drawAttraction(attraction);
      });
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){

    // load our db data into days (memory)
    for (var i = 0 ; i < all_days.length ; i++) {
      days.push({
        hotels: all_days[i].hotels || [],
        restaurants: all_days[i].restaurants || [],
        activities: all_days[i].activities || [],
        id: all_days[i]._id
      })
    }
    console.log('days before mapping', days);

    days.forEach(function(day) {
      day.hotels = day.hotels.map(function(id) { //HOTELS //HOTELS
          var hotel = hotelsIndex[id];
          hotel.type = 'hotels';
          return hotel;
      });
      day.restaurants = day.restaurants.map(function(id) {
        var rest = restaurantsIndex[id];
        rest.type = 'restaurants';
        return rest;
      });
      day.activities = day.activities.map(function(id) {
         var act = activitiesIndex[id];
         act.type = 'activities';
         return act;
      });
    })

    console.log('days after mapping', days)

    currentDay = days[0];

    switchDay(0);
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  exports.days = function () {
    console.log(days)
  }

  return exports;

}());
