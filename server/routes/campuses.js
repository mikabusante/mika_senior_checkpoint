'use strict';

const express = require('express');
const db = require('../models');
const Campus = db.models.campus;
const Student = db.models.student;

// This router is already mounted on /campuses in server/app.js
const router = express.Router();

router.get('/', (req, res, next) => {
  Campus.findAll()
  .then(campuses => res.send(campuses))
  .catch(next)
})


router.get('/:id', (req, res, next) => {
  Campus.findById(req.params.id, {
    include: [Student]
  })
  .then(campus => res.send(campus))
  .catch(next)
})

router.get('/:id/students', (req, res, next) => {
  Campus.findById(req.params.id)
  .then(campus => campus.getStudents())
  .then(students => res.send(students))
  .catch(next)
})

router.post('/', (req, res, next) => {
  Campus.create(req.body)
  .then(newCampus => {
    res.status(201).send(newCampus)
  })
  .catch(next)
})

router.post('/:id/students', (req, res, next) => {
  Student.create({
    name: req.body.name,
    phase: req.body.phase,
    campusId: req.params.id
  })
  .then(student => res.status(201).send(student))
  .catch(next);
})

module.exports = router;
