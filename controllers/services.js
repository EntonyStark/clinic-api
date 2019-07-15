const Service = require('../models/services');
const { to } = require('../utils/help-func');

const { findOneAndUpdateConfig } = require('../config/constants');

module.exports = {
	getServiceList: async (req, res) => {
		const [err, services] = await to(Service.find({}, { __v: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ services });
	},
	getServiceById: async (req, res) => {
		const [err, service] = await to(Service.findById(req.params.id, { __v: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ service });
	},
	createService: async (req, res) => {
		const { name } = req.body;

		const [err, service] = await to(Service
			.findOneAndUpdate(
				{ name },
				{ $set: { ...req.body } },
				{ ...findOneAndUpdateConfig, upsert: true }
			));
		if (err) return res.status(400).send({ message: err.message });

		return res.status(200).send({ service });
	},
	updateService: async (req, res) => {
		const { id } = req.params;

		const [err, service] = await to(Service
			.findOneAndUpdate(
				{ _id: id },
				{ $set: { ...req.body } },
				findOneAndUpdateConfig
			));
		if (err) return res.status(400).send({ message: err.message });

		return res.status(200).send({ service });
	},
	removeService: async (req, res) => {
		const [err, service] = await to(Service.findOneAndRemove(
			{ _id: req.params.id },
			{ useFindAndModify: false }
		));
		if (err) return res.status(400).send({ message: err.message });
		if (!service) return res.status(404).send({ message: 'Service not found' });

		return res.status(200).send({ message: `${service.name} successfully removed` });
	}
};
