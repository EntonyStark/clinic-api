const express = require('express');

const reviews = require('../controllers/reviews');
const { authenticationMiddleware } = require('../utils/help-func');

const router = express.Router();

router.get('/', reviews.getReviewsList);
router.post('/', authenticationMiddleware, reviews.createReviews);
router.put('/:id', authenticationMiddleware, reviews.updateReviews);
router.delete('/:id', authenticationMiddleware, reviews.removeReviews);

module.exports = router;
