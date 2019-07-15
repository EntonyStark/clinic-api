const mongoose = require('mongoose');

const { Schema } = mongoose;

const servicesSchema = new Schema({
	description: {
		type: String
	},
	duration: {
		required: true,
		type: Number
	},
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	price: {
		required: true,
		type: Number
	}
}, { timestamps: true });

module.exports = mongoose.model('services', servicesSchema);