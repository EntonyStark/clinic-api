module.exports = {
	to: promise => promise.then(data => [null, data]).catch(err => [err]),
	authenticationMiddleware: (req, res, next) => {
		console.log('req.isAuthenticated()', req.isAuthenticated());
		console.log('req,', req.session);
		console.log('req.user', req.user);
		if (req.isAuthenticated()) return next();

		return res.send('un');
	}
};
