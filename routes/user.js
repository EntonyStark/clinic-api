const express = require('express');

const user = require('../controllers/user');
const { authenticationMiddleware } = require('../utils/help-func');

const router = express.Router();

router.get('/', user.getUserList);
router.get('/:id', user.getUserById);
router.put('/:id', authenticationMiddleware, user.updateUser);
router.delete('/:id', authenticationMiddleware, user.removeUser);

module.exports = router;
