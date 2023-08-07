const express = require('express');
const router = express.Router();
const dbController = require('../controllers/db.controller');
const db = require('../../models/db');

// Endpoints para solicitudes hechas desde el bot hacia la BD
router.get('/get-post/:tag_name', dbController.getPostByTag);

module.exports = router;