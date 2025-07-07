const express = require('express');
const paymentController = require('../controller/paymentController');
const { isUserLoggedIn } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');




const router = express.Router();

router.use(isUserLoggedIn);

router.post('/create-order', authorize('payment:create'), paymentController.createOrder);
router.post('/verify-order', authorize('payment:create'), paymentController.verifyOrder);

module.exports = router;