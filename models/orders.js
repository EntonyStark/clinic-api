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
	doctor: {
		type: Schema.Types.ObjectId,
		ref: 'doctors'
	},
	spec: {
		type: Schema.Types.ObjectId,
		ref: 'services'
	}
}, { timestamps: true });

module.exports = mongoose.model('orders', ordersSchema);
