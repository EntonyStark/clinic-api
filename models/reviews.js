const mongoose = require('mongoose');

const { Schema } = mongoose;

const rewiewsSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	}
}, { timestamps: true });

module.exports = mongoose.model('rewiews', rewiewsSchema);
