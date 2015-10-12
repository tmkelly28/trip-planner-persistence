var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name: String,
	trip: { type: [mongoose.Schema.Types.ObjectId], ref: 'Day'}
})

module.exports = mongoose.model('User', userSchema);