'use strict';

const Sequelize = require('sequelize');
const db = require('./_db');

const Student = db.define('student', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  phase: {
    type: Sequelize.ENUM('junior', 'senior')
  }
});

Student.findByPhase = function(phase) {
  return Student.findAll({
    where: {
      phase
    }
  })
}
module.exports = Student;
