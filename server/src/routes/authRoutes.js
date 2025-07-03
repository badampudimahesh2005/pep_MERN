const express = require('express');

const { login, logout , signup, googleAuth} = require('../controller/authController');
const { isUserLoggedIn } = require('../middleware/authMiddleware');

const {body} = require('express-validator');

const router = express.Router();

const loginValidator = [
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({min:6}).withMessage('Password must be at least 6 characters long')
];

const signupValidator = [
    body('username')
    .notEmpty().withMessage('Username is required'),
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({min:6}).withMessage('Password must be at least 6 characters long')
];


router.post('/login', loginValidator, login);
router.post('/signup', signupValidator, signup);

router.post('/logout', isUserLoggedIn, logout);
router.get('/check', isUserLoggedIn, (req, res) => {
    res.status(200).json({
        isLoggedIn: true,
        userDetails: {
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
        }
    });
});

router.post('/google-login', googleAuth);
module.exports = router;
