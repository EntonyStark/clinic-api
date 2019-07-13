const mongoose = require('mongoose');

const { Schema } = mongoose;

const doctorsSchema = new Schema({
	experience: {
		type: Date,
		required: true
	},
	photo: {
		type: String
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	profession: {
		type: String,
		required: true,
		trim: true
	},
	skillsDescription: {
		type: String
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	speciality: [{
		type: Schema.Types.ObjectId,
		ref: 'services'
	}]
}, { timestamps: true });

module.exports = mongoose.model('doctors', doctorsSchema);
