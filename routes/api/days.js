var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');


// Adding a day
router.post('/api/day', function(req, res, next) {
	var numDay = Number(req.body.numDay);
	Day.create({number: numDay})
		.then(function(day) {
			res.json(day);
		})
		.then(null, next);
});


// // Get information for a day
// router.get('/api/...', function(req, res, next) {

// })

// Adding a hotel for a day
router.post('/api/:dayid/hotels/:attrid/add', function(req, res, next) {
	var dayId = req.params.dayid;
	var attractionId = req.params.attrid;
	console.log('attractionId in route', attractionId);

	Day.findByIdAndUpdate(dayId, {$push: {hotels: attractionId}})
		.then(function(day) {
			res.end()
		}, function(error) { next(error)
	})
});

// Adding a restaurant for a day
router.post('/api/:dayid/restaurants/:attrid/add', function(req, res, next) {
	var dayId = req.params.dayid;
	var attractionId = req.params.attrid;

	Day.findByIdAndUpdate(dayId, {$push: {restaurants: attractionId}})
		.then(function(day) {
			res.end()
		}, function(error) { next(error)
	})
});
// Adding an activity for a day
router.post('/api/:dayid/activities/:attrid/add', function(req, res, next) {
	var dayId = req.params.dayid;
	var attractionId = req.params.attrid;

	Day.findByIdAndUpdate(dayId, {$push: {activities: attractionId}})
		.then(function(day) {
			res.end()
		}, function(error) { next(error)
	})
});



// Removing a hotel for a day
router.delete('/api/:dayid/hotels/:attrid/delete', function(req, res, next) {
	var dayId = req.params.dayid;
	var attractionId = req.params.attrid;

	Day.findByIdAndUpdate(dayId, {$pull: {hotels: attractionId}})
		.then(function(day) {
			res.end()
		}, function(error) { next(error)
	})
});

// Removing a restaurant for a day
router.delete('/api/:dayid/restaurants/:attrid/delete', function(req, res, next) {
	var dayId = req.params.dayid;
	var attractionId = req.params.attrid;

	Day.findByIdAndUpdate(dayId, {$pull: {restaurants: attractionId}})
		.then(function(day) {
			res.end()
		}, function(error) { next(error)
	})
});
// Removing an activity for a day
router.delete('/api/:dayid/activities/:attrid/delete', function(req, res, next) {
	var dayId = req.params.dayid;
	var attractionId = req.params.attrid;

	Day.findByIdAndUpdate(dayId, {$pull: {activities: attractionId}})
		.then(function(day) {
			res.end()
		}, function(error) { next(error)
	})
});

// Deleting a day
router.delete('/api/day', function(req, res, next) {
	var dayId = req.body.dayId;
	Day.remove({_id: dayId})
		.then(function() {
			res.end()
		})
		.then(null, next);
});



module.exports = router;