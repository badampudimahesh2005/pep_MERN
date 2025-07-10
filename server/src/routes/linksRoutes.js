const express = require('express');

const router = express.Router();
const { isUserLoggedIn } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');
const {
    createLink,
    getLinks,
    getLinkById,
    updateLink,
    deleteLink,
    redirectLink,
    analytics
} = require('../controller/linksController');

router.use(isUserLoggedIn);

// Analytics route
router.get('/analytics', authorize('link:read'), analytics);

//get all links 
router.get('/',authorize('link:read'), getLinks);
//get link by id
router.get('/:id',authorize('link:read'), getLinkById);

//create a new link
router.post('/create',authorize('link:create'), createLink);

//update a link
router.put('/:id', authorize('link:update'), updateLink);

//delete a link
router.delete('/:id', authorize('link:delete'), deleteLink);

//redirect to the original link
router.get('/r/:id', redirectLink);






module.exports = router;