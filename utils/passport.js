// const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = (passport) => {
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	async (email, password, done) => {
		const user = await User.findOne({ email }, { __v: 0 })
			.catch(() => done({ message: 'Error on the server.' }, false));

		if (!user) return done(null, false, { code: 404, message: 'User not found' });

		return bcrypt.compare(password, user.password, (err, matched) => {
			if (err) return err;
			if (!matched) return done(null, false, { code: 401, message: 'Incorrect email or password.' });

			return done(null, user);
		});
	}));
	passport.serializeUser((user, done) => {
		console.log('serializeUser', user);
		done(null, { _id: user._id });
	});

	passport.deserializeUser((_id, done) => {
		console.log('deserializeUser', _id);
		User.findById(_id, (err, user) => {
			if (err) {
				return done(err);
			}

			return done(null, user);
		});
	});
};
