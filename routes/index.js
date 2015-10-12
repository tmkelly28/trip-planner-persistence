var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');
var Day = models.Day;

router.get('/', function(req, res) {
  res.render('login')
})


router.get('/:user', function(req, res) {
  Promise.all([
    Hotel.find(),
    Restaurant.find(),
    Activity.find(),
    Day.find()
    ]).spread(function(hotels, restaurants, activities, day) {
      if (day.length === 0) {
        return Day.create({number: 0})
        .then(function(day) {
          return [hotels, restaurants, activities, [day]]
        })
      } else {
        return [hotels, restaurants, activities, day]
      }
    }).then(function(data) {
      res.render('index', {
        all_hotels: data[0],
        all_restaurants: data[1],
        all_activities: data[2],
        all_days: data[3]
    });
  })
})

router.use(require('./api/days.js'));

module.exports = router;
