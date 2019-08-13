const express = require('express');

const orders = require('../controllers/orders');
const { authenticationMiddleware } = require('../utils/help-func');

const router = express.Router();

router.get('/', orders.getOrderList);
router.post('/', orders.createOrder);
router.put('/:id', authenticationMiddleware, orders.updateOrder);
router.delete('/:id', authenticationMiddleware, orders.removeOrder);

module.exports = router;
