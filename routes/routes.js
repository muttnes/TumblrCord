const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');
const db = require('../models/db');

router.get('/get-post/:tag_name', dbController.getPostByTag);

module.exports = router;