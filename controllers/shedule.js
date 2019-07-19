const Doctor = require('../models/doctors');
const Shedule = require('../models/shedule');
const { to } = require('../utils/help-func');

module.exports = {
	getSheduleByDoctorId: async (req, res) => {
		const { doctor } = req.query;
		const [err, shedule] = await to(Shedule
			.find({ doctor }, { __v: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ shedule });
	},
	createShedule: async (req, res) => {
		const [e, currentDoctor] = await to(Doctor.findById({ _id: req.body.doctor }).populate('shedule'));
		if (e) return res.status(404).send({ message: e.message });

		const canAddDate = currentDoctor.shedule.some((el) => {
			const sheduleDate = el.data.toJSON().split('T')[0];
			return req.body.data === sheduleDate;
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

		if (req.body['08:00'] !== undefined) shedule['08:00'] = req.body['08:00'];
		if (req.body['09:00'] !== undefined) shedule['09:00'] = req.body['09:00'];
		if (req.body['10:00'] !== undefined) shedule['10:00'] = req.body['10:00'];
		if (req.body['11:00'] !== undefined) shedule['11:00'] = req.body['11:00'];
		if (req.body['12:00'] !== undefined) shedule['12:00'] = req.body['12:00'];
		if (req.body['13:00'] !== undefined) shedule['13:00'] = req.body['13:00'];
		if (req.body['14:00'] !== undefined) shedule['14:00'] = req.body['14:00'];
		if (req.body['15:00'] !== undefined) shedule['15:00'] = req.body['15:00'];
		if (req.body['16:00'] !== undefined) shedule['16:00'] = req.body['16:00'];
		if (req.body['17:00'] !== undefined) shedule['17:00'] = req.body['17:00'];

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
