const express = require('express');

const services = require('../controllers/services');

const router = express.Router();

router.get('/', services.getServiceList);
router.get('/:id', services.getServiceById);
router.post('/', services.createService);
router.put('/:id', services.updateService);
router.delete('/:id', services.removeService);

module.exports = router;
