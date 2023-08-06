const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');
const tumblrController = require('../controllers/tumblrController');
const db = require('../models/db');

router.get('/tumblr/posts/:tag', tumblrController.getTumblrPostsByTag);
router.get('/get-post/:tag_name', dbController.getPostByTag);

module.exports = router;