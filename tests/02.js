'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiThings = require('chai-things');
chai.use(chaiThings);

const db = require('../server/models');
const Campus = db.models.campus;
const Student = db.models.student;

const app = require('../server/app');
const agent = require('supertest')(app);

describe('Tier Two', () => {
  beforeEach(() => db.sync({ force: true }));

  after(() => db.sync({ force: true }));

  // Student model (name, ENUM for phase)
  describe('Student model', () => {
    describe('Validations', () => {
      let student;

      beforeEach(() => {
        student = Student.build();
      });


      it('should require name', () => {
        return student.validate()
        .then(result => {
          expect(result).to.be.an('object');
          expect(result.errors).to.contain.a.thing.with.property('path', 'name');
        });
      });

      it('should have a phase property of either "junior" or "senior"', () => {
        student.phase = "super";
        return student.save()
        .then(result => {
          throw new Error ('Promise should have rejected.');
        }, err => {
          expect(err).to.exist;
          expect(err.message).to.contain('phase');
        });
      });

    });
  });

  // Associate with Campus model
  describe('Campus and Student Models', () => {
    let student1, student2, campus;

    beforeEach(() => Promise.all([
        Campus.create({
          id: 1,
          name: 'Grace Hopper'
        }),
        Student.create({
          name: 'Terry Horowitz',
          phase: 'junior',
          campusId: 1
        }),
        Student.create({
          name: 'Yuval Idan',
          phase: 'senior',
          campusId: 1
        })
      ])
      .then(([ _campus, _student1, _student2 ]) => {
        campus = _campus;
        student1 = _student1;
        student2 = _student2;
      })
    );

    it('should be associated', () => {
      // testing Campus.hasMany(Student);
      return campus.hasStudents([student1, student2])
      .then(result => {
        expect(result).to.be.true;
      })
    });
  });

  // Route to fetch all students from a campus (classMethod or eager loading? both?)
  describe('Campus routes', () => {
    describe('GET /campuses/:id/students', () => {
      beforeEach(() => Promise.all([
          Campus.create({
            id: 1,
            name: 'Grace Hopper'
          }),
          Student.create({
            name: 'Terry Horowitz',
            phase: 'junior',
            campusId: 1
          }),
          Student.create({
            name: 'Yuval Idan',
            phase: 'senior',
            campusId: 1
          })
        ])
      );

      it('should get all students associated with a campus', () => {
        return agent.get('/campuses/1/students')
        .expect(200)
        .then(res => {
          expect(res.body.students).to.have.length(2)
        })
      });
    });
  });

  // CampusView component
  describe('', () => {});

  // Write Redux thunk action for selected Campus and students
  describe('', () => {});
});
