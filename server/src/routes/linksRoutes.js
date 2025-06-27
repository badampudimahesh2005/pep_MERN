const express = require('express');

const router = express.Router();
const { isUserLoggedIn } = require('../middleware/authMiddleware');
const {
    createLink,
    getLinks,
    getLinkById,
    updateLink,
    deleteLink,
    redirectLink,
} = require('../controller/linksController');

router.use(isUserLoggedIn);

router.get('/r/:id', redirectLink);

router.post('/create', createLink);

router.get('/', getLinks);

router.get('/:id', getLinkById);

router.put('/:id', updateLink);

router.delete('/:id', deleteLink);

module.exports = router;