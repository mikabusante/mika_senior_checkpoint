'use strict';

const Sequelize = require('sequelize');
const db = require('./_db');

const Student = db.define('student', {});

module.exports = Student;
