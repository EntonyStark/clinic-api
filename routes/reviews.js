const express = require('express');

const reviews = require('../controllers/reviews');

const router = express.Router();

router.get('/', reviews.getReviewsList);
router.post('/', reviews.createReviews);
router.put('/:id', reviews.updateReviews);
router.delete('/:id', reviews.removeReviews);

module.exports = router;
