const mongoose = require('mongoose');

const { Schema } = mongoose;

const ordersSchema = new Schema({
	date: {
		type: Date,
		required: true
	},
	time: {
		type: String,
		required: true
	},
	comment: {
		type: String
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	shedule: {
		type: Schema.Types.ObjectId,
		ref: 'shedule'
	},
	doctor: {
		type: Schema.Types.ObjectId,
		ref: 'doctors'
	},
	spec: {
		type: Schema.Types.ObjectId,
		ref: 'services'
	},
	orderNumber: {
		type: Number,
		required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('orders', ordersSchema);
