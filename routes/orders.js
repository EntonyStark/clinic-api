const express = require('express');

const orders = require('../controllers/orders');

const router = express.Router();

router.get('/', orders.getOrderList);
router.post('/', orders.createOrder);
router.put('/:id', orders.updateOrder);
router.delete('/:id', orders.removeOrder);

module.exports = router;
