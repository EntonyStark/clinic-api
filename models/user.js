const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
	firstName: {
		required: true,
		type: String
	},
	lastName: {
		required: true,
		type: String
	},
	phone: {
		required: true,
		type: String
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: Number,
		required: true,
		default: false
	}
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);
