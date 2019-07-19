const Doctor = require('../models/doctors');
const Shedule = require('../models/shedule');
const { to } = require('../utils/help-func');

const { timeTable } = require('../config/constants');

module.exports = {
	getSheduleByDoctorId: async (req, res) => {
		const { doctor } = req.query;
		const [err, shedule] = await to(Shedule
			.find({ doctor }, { __v: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ shedule });
	},
	createShedule: async (req, res) => {
		// eslint-disable-next-line no-restricted-globals
		const isValidDate = d => d instanceof Date && !isNaN(d);
		const isValidDateProp = isValidDate(new Date(req.body.data));
		if (!isValidDateProp) return res.status(404).send({ message: 'Invalid date' });

		const [e, currentDoctor] = await to(Doctor.findById({ _id: req.body.doctor }).populate('shedule'));
		if (e) return res.status(404).send({ message: e.message });

		const canAddDate = currentDoctor.shedule.some((el) => {
			const sheduleDate = new Date(el.data).toJSON().split('T')[0];
			const incomingDate = new Date(req.body.data).toJSON().split('T')[0];
			return incomingDate === sheduleDate;
		});
		if (canAddDate) return res.status(404).send({ message: `${req.body.data} already exist in doctor shedule` });

		const [err, shedule] = await to(new Shedule({ ...req.body }).save());
		if (err) return res.status(404).send({ message: err.message });

		currentDoctor.shedule.push(shedule);
		await currentDoctor.save();

		return res.status(200).send({ shedule });
	},
	updateShedule: async (req, res) => {
		const [err, shedule] = await to(Shedule.findById({ _id: req.params.id }));
		if (err) return res.status(400).send({ message: err.message });

		timeTable.forEach((el) => {
			if (req.body[el] !== undefined) shedule[el] = req.body[el];
		});

		const [e, updatedShedule] = await to(shedule.save());
		if (e) return res.status(400).send({ message: e.message });

		return res.status(200).send({ shedule: updatedShedule });
	},
	removeShedule: async (req, res) => {
		const [err, shedule] = await to(Shedule.findOneAndDelete({ _id: req.params.id }));

		if (err) return res.status(400).send({ message: err.message });
		if (!shedule) return res.status(400).send({ message: 'Change not saved' });

		const [e] = await to(Doctor.updateOne(
			{ _id: shedule.doctor },
			{ $pullAll: { shedule: [shedule.id] } }
		));
		if (e) return res.status(404).send({ message: e.message });

		return res.status(200).send({ message: 'Shedule successfully removed' });
	}
};
