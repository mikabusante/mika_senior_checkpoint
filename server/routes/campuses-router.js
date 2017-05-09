const express = require('express');
const db = require('../models');
const Campus = db.model('campus');

// This router is already mounted on /users in server/app.js
const router = express.Router();

module.exports = router;
