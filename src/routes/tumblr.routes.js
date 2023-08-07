const express = require('express');
const router = express.Router();
const tumblrController = require('../controllers/tumblr.controller');
const dbController = require('../controllers/db.controller');

// Endpoints para peticiones a tumblr
router.get('/tumblr/posts/:tag', tumblrController.getTumblrPostsByTag);

module.exports = router;
