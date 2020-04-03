"use strict";

const express = require("express");
const db = require("../models");
const Campus = db.models.campus;
const Student = db.models.student;

// This router is already mounted on `/api/campuses` in server/app.js
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allCampuses = await Campus.findAll();
    res.json(allCampuses);
  } catch (err) {
    next(err);
  }
});

router.get("/:campusId", async (req, res, next) => {
  try {
    const foundCampus = await Campus.findByPk(req.params.campusId, {
      include: [Student]
    });
    res.json(foundCampus);
  } catch (err) {
    next(err);
  }
});

router.get("/:campusId/students", async (req, res, next) => {
  try {
    const foundStudents = await Student.findAll({
      where: {
        campusId: req.params.campusId
      }
    });

    res.json(foundStudents);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;
  try {
    const newCampus = await Campus.create({ name });
    res.status(201).json(newCampus);
  } catch (err) {
    next(err);
  }
});

router.post("/:campusId/students", async (req, res, next) => {
  const { name, phase } = req.body;
  try {
    const newStudent = await Student.create({
      name,
      phase,
      campusId: req.params.campusId
    });
    res.status(201).json(newStudent);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
