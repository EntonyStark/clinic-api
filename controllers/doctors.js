const Doctor = require('../models/doctors');
const User = require('../models/user');
const Shedule = require('../models/shedule');
const { to } = require('../utils/help-func');

module.exports = {
	getDoctorList: async (req, res) => {
		const [err, doctors] = await to(Doctor
			.find({}, { __v: 0 })
			.populate('user', { __v: 0, password: 0 })
			.populate('speciality', { __v: 0 })
			.populate('shedule', { __v: 0, doctor: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ doctors });
	},
	getDoctorById: async (req, res) => {
		const [err, doctor] = await to(Doctor
			.findById(req.params.id, { __v: 0 })
			.populate('user', { __v: 0, password: 0 })
			.populate('speciality', { __v: 0 })
			.populate('shedule', { __v: 0, doctor: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ doctor });
	},
	createDoctor: async (req, res) => {
		if (req.body.user) {
			const [e, user] = await to(User.find({}, { __v: 0 }));
			if (e) return res.status(404).send({ message: e.message });

			user.doctor = true;

			await user.save();
		}

		const [err, doctors] = await to(new Doctor(req.body).save());
		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ doctors });
	},
	updateDoctor: async (req, res) => {
		const {
			experience, name, photo, profession, skillsDescription, speciality, user
		} = req.body;

		const [err, doctor] = await to(Doctor.findById(req.params.id, { __v: 0 }));
		if (err) return res.status(404).send({ message: err.message });

		if (experience) doctor.experience = experience;
		if (name) doctor.name = name;
		if (photo) doctor.photo = photo;
		if (skillsDescription) doctor.skillsDescription = skillsDescription;
		if (profession) doctor.profession = profession;
		if (user || user === null) doctor.user = user;
		if (speciality) {
			if (typeof speciality === 'string') {
				doctor.speciality.push(speciality);
			}
			else if (Array.isArray(speciality)) {
				const uniqueArray = [...new Set([
					...speciality,
					...doctor.speciality.map(el => String(el))
				])];
				doctor.speciality = uniqueArray;
			}
		}

		const [e, updateDoctor] = await to(doctor.save());
		if (e) return res.status(404).send({ message: e.message });

		return res.status(200).send({ doctor: updateDoctor });
	},
	removeDoctor: async (req, res) => {
		const [err, doctor] = await to(Doctor.findOneAndRemove(
			{ _id: req.params.id },
			{ useFindAndModify: false }
		));
		if (err) return res.status(400).send({ message: err.message });
		if (!doctor) return res.status(404).send({ message: 'Review not found' });

		const [error, shedule] = await to(Shedule.find({ doctor: doctor._id }));
		if (error) return res.status(400).send({ message: error.message });

		shedule.forEach(el => el.remove());

		return res.status(200).send({ message: `${doctor.name} successfully removed` });
	}
};
