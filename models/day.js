var mongoose = require('mongoose');

var daySchema = new mongoose.Schema({
	number: Number,
	hotels: {type: [mongoose.Schema.Types.ObjectId], ref: 'Hotel'},
	restaurants: {type: [mongoose.Schema.Types.ObjectId], ref: 'Restaurant'},
	activities: {type: [mongoose.Schema.Types.ObjectId], ref: 'Activity'},
	user: String
});


module.exports = mongoose.model('Day', daySchema);