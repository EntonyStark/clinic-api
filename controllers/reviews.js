const Reviews = require('../models/reviews');
const { to } = require('../utils/help-func');

module.exports = {
	getReviewsList: async (req, res) => {
		const [err, reviews] = await to(Reviews.find({}, { __v: 0 }));
		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ reviews });
	},
	createReviews: async (req, res) => {
		const { text } = req.body;

		const [err, {
			_id, user, createdAt, updatedAt
		}] = await to(new Reviews({
			text, user: req.user
		}, { user: 0 }).save());
		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({
			review: {
				_id, text, user: user._id, createdAt, updatedAt
			}
		});
	},
	updateReviews: async (req, res) => {
		const [err, review] = await to(Reviews.findById(req.params.id, { __v: 0 }));
		if (err) return res.status(404).send({ message: err.message });

		if (req.body.text) review.text = req.body.text;

		const [e, updatereview] = await to(review.save());
		if (e) return res.status(404).send({ message: e.message });

		return res.status(200).send({ review: updatereview });
	},
	removeReviews: async (req, res) => {
		const [err, doctor] = await to(Reviews.findOneAndRemove(
			{ _id: req.params.id },
			{ useFindAndModify: false }
		));
		if (err) return res.status(400).send({ message: err.message });
		if (!doctor) return res.status(404).send({ message: 'Review not found' });

		return res.status(200).send({ message: 'Review successfully removed' });
	}
};
