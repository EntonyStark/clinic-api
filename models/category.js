const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
	name: {
		type: String,
		required: true
	},
	services: [{
		type: Schema.Types.ObjectId,
		ref: 'services'
	}]
}, { timestamps: true });

module.exports = mongoose.model('category', categorySchema);
