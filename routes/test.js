const express = require('express');

// const auth = require('../controllers/auth');

const router = express.Router();

router.get('/', (req, res) => {
	res.send('protected');
});


module.exports = router;
