const mongoose = require('mongoose');

const { Schema } = mongoose;

const sheduleSchema = new Schema({
	data: {
		type: String,
		required: true
	},
	doctor: {
		type: Schema.Types.ObjectId,
		ref: 'doctors'
	},
	'08:00': {
		type: Boolean,
		default: true
	},
	'09:00': {
		type: Boolean,
		default: true
	},
	'10:00': {
		type: Boolean,
		default: true
	},
	'11:00': {
		type: Boolean,
		default: true
	},
	'12:00': {
		type: Boolean,
		default: true
	},
	'13:00': {
		type: Boolean,
		default: true
	},
	'14:00': {
		type: Boolean,
		default: true
	},
	'15:00': {
		type: Boolean,
		default: true
	},
	'16:00': {
		type: Boolean,
		default: true
	},
	'17:00': {
		type: Boolean,
		default: true
	}
}, { timestamps: true });

module.exports = mongoose.model('shedule', sheduleSchema);
