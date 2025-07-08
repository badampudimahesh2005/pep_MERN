const express = require('express');
const paymentController = require('../controller/paymentController');
const { isUserLoggedIn } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');




const router = express.Router();

//Enable raw delivery to enble signature verfication
router.post('/webhook', express.raw({
    type: 'application/json',
}), paymentController.handleWebhookEvent);



router.use(isUserLoggedIn);

router.post('/create-order', authorize('payment:create'), paymentController.createOrder);
router.post('/verify-order', authorize('payment:create'), paymentController.verifyOrder);

router.post('/create-subscription', authorize('payment:create'), paymentController.createSubscription);
router.post('/verify-subscription', authorize('payment:create'), paymentController.verifySubscription);
router.post('/cancel-subscription', authorize('payment:create'), paymentController.cancelSubscription);

module.exports = router;