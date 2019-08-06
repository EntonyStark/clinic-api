const express = require('express');

const shedule = require('../controllers/shedule');
const { authenticationMiddleware } = require('../utils/help-func');

const router = express.Router();

router.get('/', shedule.getSheduleByDoctorId);
router.post('/', authenticationMiddleware, shedule.createShedule);
router.put('/:id', authenticationMiddleware, shedule.updateShedule);
router.delete('/:id', authenticationMiddleware, shedule.removeShedule);

module.exports = router;
