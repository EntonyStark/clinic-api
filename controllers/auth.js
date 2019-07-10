const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');
const { to } = require('../utils/help-func');

module.exports = {
	login: async (req, res, next) => {
		passport.authenticate('local',
			{ successRedirect: '/', failureRedirect: '/login' }, (err, user, info) => {
				console.log('info', info);
				console.log('err, ', err);
				if (info) return res.status(info.code || 401).send({ message: info.message });

				return res.status(200).send({ user });
			})(req, res, next);
	},
	register: async (req, res) => {
		const {
			firstName, lastName, email, phone, password, confirmPassword
		} = req.body;
		const user = await User.findOne({ email });
		if (user) return res.status(400).send({ message: 'User already exist' });

		if (!password) return res.status(401).send({ message: 'Missing password' });
		if (password !== confirmPassword) return res.status(401).send({ message: 'Passwords do not match' });

		const salt = await bcrypt.genSalt(10);
		const hashPass = await bcrypt.hash(password, salt);

		const [err, newUser] = await to(new User({
			firstName,
			lastName,
			email,
			phone,
			password: hashPass
		}).save());

		if (err) return res.status(400).send({ error: err.message });

		return res.status(200).send({
			message: 'User was successfully register',
			id: newUser._id
		});
	}
};
