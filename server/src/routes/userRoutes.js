const express = require('express');


const router = express.Router();

const { isUserLoggedIn } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');
const {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
 } = require('../controller/userController');

// Middleware to check if user is logged in
router.use(isUserLoggedIn);

// Get all users
router.get('/', authorize('user:read'), getUsers);

// Create a new user
router.post('/create', authorize('user:create'), createUser);

// Update a user
router.put('/:id', authorize('user:update'), updateUser);

// Delete a user
router.delete('/:id', authorize('user:delete'), deleteUser);


module.exports = router;