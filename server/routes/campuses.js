'use strict';

const express = require('express');
const db = require('../models');
const Campus = db.models.campus;
const Student = db.models.student;

// This router is already mounted on /campuses in server/app.js
const router = express.Router();

module.exports = router;
