var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');
var Day = models.Day;
var User = models.User;

router.get('/', function(req, res) {
  res.render('login')
})

router.get('/:user', function(req, res) {
  res.render('login');
})

router.get('/validate', function(req, res) {
  var name = req.query.name;
  User.findOne({ name: name }).exec()
  .then(function(user) {
    if (!user) {
      return User.create({
        name: name,
        trip: []
      });
    }
    console.log('USERRRRRRRR', user, user.name);
    return user;
  })
  .then(function(user) {
    res.redirect('/' + user.name);
  }, function(err) {
    next(err);
  });
});

router.get('/:user', function(req, res) {
  var user = req.params.user;
  Promise.all([
    Hotel.find(),
    Restaurant.find(),
    Activity.find(),
    Day.find({ user: user })
    ]).spread(function(hotels, restaurants, activities, day) {
      if (day.length === 0) {
        return Day.create({number: 0, user: user})
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
        all_days: data[3],
        user: user
    });
  })
})

router.use(require('./api/days.js'));

module.exports = router;
