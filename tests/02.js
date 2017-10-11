'use strict';

// Assertions
const chai = require('chai');
const expect = chai.expect;
const chaiThings = require('chai-things');
chai.use(chaiThings);

// Models
const db = require('../server/models');
const Campus = db.models.campus;
const Student = db.models.student;

// Routes
const app = require('../server/app');
const agent = require('supertest')(app);

// Components
import React from 'react';
import { shallow } from 'enzyme';
import SingleCampus from '../client/components/SingleCampus'
import SingleStudent from '../client/components/SingleStudent'

// Redux
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { SELECT_CAMPUS } from '../client/redux/constants';
import { selectCampus } from '../client/redux/actions';

describe('Tier Two', () => {
  before(() => db.sync({ force: true }));
  after(() => db.sync({ force: true }));

  // defined in ../server/models/student-model.js
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

    describe('Campus', () => {
      it('should have associated students', () => {
        return campus.hasStudents([student1, student2])
        .then(result => {
          expect(result).to.be.true;
        });
      });
    });

    describe('GET /campuses/:id/students route', () => {
      it('should get all students associated with a campus', () => {
        return agent.get('/campuses/1/students')
        .expect(200)
        .then(res => {
          expect(res.body).to.have.length(2);
          expect(res.body[0].campusId).to.equal(1);
        });
      });
    });
  });

  // defined in ../client/components/SingleCampus.js
  describe('<SingleCampus /> component', () => {
    const marsCampus = {
      name: 'Mars',
      students: [
        {
          name: 'Amy Wong',
          phase: 'senior'
        },
        {
          name: 'Mark Watney',
          phase: 'junior'
        },
        {
          name: 'Marvin',
          phase: 'junior'
        },
        {
          name: 'Valentine Michael Smith',
          phase: 'senior'
        }
      ]
    };

    const renderedMarsCampus = shallow(
      <SingleCampus
        campus={marsCampus}
        students={marsCampus.students}
      />
    );

    marsCampus.name = 'Red Planet'; // change campus name to test dynamic rendering
    // remove first item to render different list of students
    const firstStudent = marsCampus.students.shift();
    const renderedRedPlanetCampus = shallow(
      <SingleCampus
        campus={marsCampus}
        students={marsCampus.students}
      />
    );
    marsCampus.name = 'Mars'; // reset campus name
    marsCampus.students.unshift(firstStudent); // put first student back

    it('should render the name of the campus in an h2', () => {
      expect(renderedMarsCampus.find('h2').text()).to.equal('Mars');
      expect(renderedRedPlanetCampus.find('h2').text()).to.equal('Red Planet');
    });

    it('should render a list of <Student /> components', () => {
      const renderedMarsStudents = renderedMarsCampus.find(SingleStudent);
      expect(renderedMarsStudents.length).to.equal(4);
      expect(renderedMarsStudents.get(2).props.student.name).to.equal('Marvin');

      const renderedRedPlanetStudents = renderedRedPlanetCampus.find(SingleStudent);
      expect(renderedRedPlanetStudents.length).to.equal(3);
      expect(renderedRedPlanetStudents.get(2).props.student.name).to.equal('Valentine Michael Smith');
    });
  });

  describe('Redux', () => {
    describe('managing selected campus', () => {
      const marsCampus = { name: 'Mars' };

      describe('action creators', () => {
        it('should allow synchronous creation of SET_CAMPUS actions', () => {
          const selectCampusAction = selectCampus(marsCampus);
          expect(selectCampusAction.type).to.equal(SELECT_CAMPUS);
          expect(selectCampusAction.campus).to.equal(marsCampus);
        });
      });
    });
  });
});
