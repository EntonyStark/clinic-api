const express = require('express');

const doctor = require('../controllers/doctors');

const router = express.Router();

router.get('/', doctor.getDoctorList);
router.get('/:id', doctor.getDoctorById);
router.post('/', doctor.createDoctor);
router.put('/:id', doctor.updateDoctor);
router.delete('/:id', doctor.removeDoctor);

module.exports = router;
