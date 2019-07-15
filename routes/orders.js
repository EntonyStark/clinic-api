const express = require('express');

const orders = require('../controllers/orders');

const router = express.Router();

router.post('/', orders.createOrder);

module.exports = router;
