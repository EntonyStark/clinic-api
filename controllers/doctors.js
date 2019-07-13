const Doctor = require('../models/doctors');
const User = require('../models/user');
const { to } = require('../utils/help-func');

module.exports = {
	getDoctorList: async (req, res) => {
		const [err, doctors] = await to(Doctor
			.find({}, { __v: 0 })
			.populate('user', { __v: 0, password: 0 })
			.populate('speciality', { __v: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ doctors });
	},
	getDoctorById: async (req, res) => {
		const [err, service] = await to(Doctor
			.findById(req.params.id, { __v: 0 })
			.populate('user', { __v: 0, password: 0 })
			.populate('speciality', { __v: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ service });
	},
	createDoctor: async (req, res) => {
		const {
			experience, name, photo, profession, skillsDescription, speciality, user
		} = req.body;

		const [e] = await to(User.findById(user));
		if (e) return res.status(404).send({ message: e.message });
		if (user && !user.doctor) return res.status(404).send({ message: 'User not a doctor' });

		const [err, doctors] = await to(new Doctor({
			name, photo, experience, profession, skillsDescription, speciality, user
		}).save());
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
		if (speciality) doctor.speciality.push(speciality);

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
		if (!doctor) return res.status(404).send({ message: 'Room not found' });

		return res.status(200).send({ message: `${doctor.name} successfully removed` });
	}
};
