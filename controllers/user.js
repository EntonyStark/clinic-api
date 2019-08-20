const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { to } = require('../utils/help-func');

module.exports = {
	getUserList: async (req, res) => {
		const [err, users] = await to(User.find(req.query, { password: 0, __v: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ users });
	},
	getUserById: async (req, res) => {
		const { id } = req.params;

		const [err, user] = await to(User.findById(id, { password: 0, __v: 0 }));

		if (err) return res.status(404).send({ message: err.message });

		return res.status(200).send({ user });
	},
	updateUser: async (req, res) => {
		const user = await User.findOne({ _id: req.params.id }).catch(() => null);
		if (!user) return res.status(404).send({ message: 'User not found' });

		const localId = mongoose.Types.ObjectId(req.user._id);
		const incomeId = mongoose.Types.ObjectId(req.params.id);

		if (!req.user.role && !localId.equals(incomeId)) return res.status(403).send({ message: 'Permission denied.' });

		const {
			firstName, lastName, phone, password, confirmPassword, role, doctor
		} = req.body;

		if (password) {
			if (password !== confirmPassword) return res.status(400).send({ message: 'Passwords do not match' });

			const salt = await bcrypt.genSalt(10);
			const newHashPass = await bcrypt.hash(password, salt);
			user.password = newHashPass;
		}

		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;
		if (phone) user.phone = phone;
		if (role) {
			if (!req.user.role) return res.status(403).send({ message: 'Permission denied.' });
			user.role = role;
		}
		if (doctor !== undefined) user.doctor = doctor;

		const [err] = await to(user.save());

		if (err) return res.status(400).send({ message: err.message });

		return res.status(200).send({ message: 'All changes saved successfully' });
	},
	removeUser: async (req, res) => {
		const { id } = req.params;
		if (String(req.user._id) === id) return res.status(401).send({ message: 'User cannot delete himself' });

		const [err, user] = await to(User.findOneAndDelete({ _id: req.params.id }));

		if (err) return res.status(400).send({ message: err.message });
		if (!user) return res.status(400).send({ message: 'Change not saved' });

		return res.send({ message: `User "${user.firstName} ${user.lastName}" successfuly deleted` });
	}
};
