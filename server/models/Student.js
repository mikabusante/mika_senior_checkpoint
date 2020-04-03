"use strict";

const Sequelize = require("sequelize");
const db = require("./_db");

const Student = db.define("student", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phase: {
    type: Sequelize.ENUM("junior", "senior", null)
  }
});

Student.findByPhase = function(phase) {
  const foundStudents = Student.findAll({
    where: {
      phase: phase
    }
  });

  return foundStudents;
};

module.exports = Student;
