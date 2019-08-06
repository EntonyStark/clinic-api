const express = require('express');

const category = require('../controllers/category');
const { authenticationMiddleware } = require('../utils/help-func');

const router = express.Router();

router.get('/', category.getCategory);
router.post('/', authenticationMiddleware, category.createCategory);
router.put('/:id', authenticationMiddleware, category.updateCategory);
router.delete('/:id', authenticationMiddleware, category.removeCategory);

module.exports = router;
