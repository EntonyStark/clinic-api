const express = require('express');

const user = require('../controllers/user');

const router = express.Router();

router.get('/', user.getUserList);
router.get('/:id', user.getUserById);
router.put('/:id', user.updateUser);
router.delete('/:id', user.removeUser);

module.exports = router;
