const Category = require('../models/category');

const { to } = require('../utils/help-func');
const { findOneAndUpdateConfig } = require('../config/constants');

module.exports = {
	getCategory: async (req, res) => {
		const [err, categories] = await to(Category.find({}, { __v: 0 }).populate('services', { __v: 0 }));
		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ categories });
	},
	createCategory: async (req, res) => {
		const [err, category] = await to(new Category(req.body).save());
		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ category });
	},
	updateCategory: async (req, res) => {
		const [err, category] = await to(Category
			.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: { ...req.body } },
				findOneAndUpdateConfig
			));
		if (err) return res.status(400).send({ message: err.message });

		return res.status(200).send({ category });
	},
	removeCategory: async (req, res) => {
		const [err, category] = await to(Category.findOneAndRemove(
			{ _id: req.params.id },
			{ useFindAndModify: false }
		));
		if (err) return res.status(400).send({ message: err.message });
		if (!category) return res.status(404).send({ message: 'Category not found' });

		category.services.forEach(el => el.remove());

		return res.status(200).send({ message: 'Category successfully removed' });
	}
};
