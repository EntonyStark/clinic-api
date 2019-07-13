module.exports = {
	to: promise => promise.then(data => [null, data]).catch(err => [err]),
	authenticationMiddleware: (req, res, next) => {
		console.log('req.isAuthenticated()', req.isAuthenticated());
		if (req.isAuthenticated()) return next();

		return res.send({ message: 'Permission denied' });
	}
};
