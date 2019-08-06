const express = require('express');

const services = require('../controllers/services');
const { authenticationMiddleware } = require('../utils/help-func');

const router = express.Router();

router.get('/', services.getServiceList);
router.get('/:id', services.getServiceById);
router.post('/', authenticationMiddleware, services.createService);
router.put('/:id', authenticationMiddleware, services.updateService);
router.delete('/:id', authenticationMiddleware, services.removeService);

module.exports = router;
