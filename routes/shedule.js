const express = require('express');

const shedule = require('../controllers/shedule');

const router = express.Router();

router.get('/', shedule.getSheduleByDoctorId);
router.post('/', shedule.createShedule);
router.put('/:id', shedule.updateShedule);
router.delete('/:id', shedule.removeShedule);

module.exports = router;
