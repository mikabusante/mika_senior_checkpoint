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
  before(() => db.sync({ force: true }));

  after(() => db.sync({ force: true }));

  // Student model
  describe('Student model', () => {
    describe('Validations', () => {
      let student;

      before(() => {
        student = Student.build();
      });


      it('should require name', () => {
        return student.validate()
        .then(() => {
          throw new Error('Validation succeeded but should have failed')
        }, err => {
          expect(err.message).to.contain('name');
        });
      });

      it('should have a phase property of either "junior" or "senior"', () => {
        student.name = "Mariya Bogorodova"
        student.phase = "super";

        return student.save()
        .then(() => {
          throw new Error ('Promise should have rejected.');
        }, err => {
          expect(err).to.exist;
          expect(err.message).to.contain('phase');
        });
      });

    });
  });

  // Associate with Campus model
  describe('Campus/Student association', () => {
    let student1, student2, campus;

    before(() => Promise.all([
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

    describe('Models', () => {
      it('should be associated', () => {
        return campus.hasStudents([student1, student2])
        .then(result => {
          expect(result).to.be.true;
        });
      });
    });

    // Route to fetch all students from a campus (classMethod or eager loading? both?)
    describe('GET /campuses/:id/students route', () => {
      it('should get all students associated with a campus', () => {
        return agent.get('/campuses/1/students')
        .expect(200)
        .then(res => {
          expect(res.body.students).to.have.length(2);
          expect(res.body.students[1].phase).to.exist;
        });
      });
    });
  });

  // CampusView component
  describe('', () => {});

  // Write Redux thunk action for selected Campus and students
  describe('', () => {});
});
