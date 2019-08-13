const express = require('express');

const doctor = require('../controllers/doctors');
const { authenticationMiddleware } = require('../utils/help-func');

const router = express.Router();

router.get('/', doctor.getDoctorList);
router.get('/:id', doctor.getDoctorById);
router.post('/', authenticationMiddleware, doctor.createDoctor);
router.put('/:id', doctor.updateDoctor);
router.delete('/:id', authenticationMiddleware, doctor.removeDoctor);

module.exports = router;
