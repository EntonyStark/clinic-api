const express = require('express');

const auth = require('../controllers/auth');

const router = express.Router();

router.post('/login', auth.login);
router.post('/register', auth.register);
router.get('/logout', auth.logOut);

module.exports = router;
