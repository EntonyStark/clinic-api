const Service = require('../models/services');
const Category = require('../models/category');
const { to } = require('../utils/help-func');

// const { findOneAndUpdateConfig } = require('../config/constants');

module.exports = {
	getServiceList: async (req, res) => {
		const [err, services] = await to(Service.find({}, { __v: 0 }).populate('category', { name: 1 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ services });
	},
	getServiceById: async (req, res) => {
		const [err, service] = await to(Service.findById(req.params.id, { __v: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ service });
	},
	createService: async (req, res) => {
		const { category } = req.body;

		const [err, service] = await to(new Service(req.body).save());
		if (err) return res.status(400).send({ message: err.message });

		const [e, currentCategory] = await to(Category.findById({ _id: category }));
		if (e) return res.status(400).send({ message: e.message });

		currentCategory.services.push(service);
		await currentCategory.save();

		return res.status(200).send({ service });
	},
	updateService: async (req, res) => {
		const {
			description, name, duration, price, category
		} = req.body;

		const [err, service] = await to(Service.findById({ _id: req.params.id }));
		if (err) return res.status(400).send({ message: err.message });

		if (description) service.description = description;
		if (name) service.name = name;
		if (duration) service.duration = duration;
		if (price) service.price = price;
		if (category) {
			service.category = category;
		}

		const [e, updatedService] = await to(service.save());
		if (e) return res.status(400).send({ message: e.message });

		if (category) {
			await Category.updateOne({ _id: service.category }, { $pullAll: { shedule: [service._id] } });
			const cat = await Category.findById({ _id: category });
			const hasDuplicate = cat.services.some(el => el.toString() === service._id.toString());
			if (!hasDuplicate) cat.services.push(updatedService);
		}

		return res.status(200).send({ service: updatedService });
	},
	removeService: async (req, res) => {
		const [err, service] = await to(Service.findOneAndRemove(
			{ _id: req.params.id },
			{ useFindAndModify: false }
		));
		if (err) return res.status(400).send({ message: err.message });
		if (!service) return res.status(404).send({ message: 'Service not found' });

		await Category.updateOne({ _id: service.category }, { $pullAll: { shedule: [service._id] } });

		return res.status(200).send({ message: `${service.name} successfully removed` });
	}
};
