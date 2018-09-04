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
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);
const initialState = {
  campuses: [],
  selectedCampus: {},
  students: []
};
const store = mockStore(initialState);
import reducer from '../client/redux/reducer';
import { SELECT_CAMPUS } from '../client/redux/constants';
import { fetchCampuses, selectCampus } from '../client/redux/actions';

// Utils
const utils = require('../utils');

describe('Tier Two', () => {
  describe('Back-end', () => {
    // defined in ../server/models/Student.js
    describe('Student model', () => {
      describe('Validations', () => {
        let student;

        before(() => {
          student = Student.build();
        });

        xit('should require name', async () => {
          try {
            await student.validate()
            throw new Error('Validation succeeded but should have failed')
          } catch (err) {
            expect(err.message).to.contain('name');
          }
        });

        xit('should have a phase property of either "junior" or "senior"', async () => {
          student.name = "Mariya Dova"
          student.phase = "super";

          try {
            await student.save()
            throw new Error('Promise should have rejected.');
          } catch (err) {
            expect(err).to.exist; // eslint-disable-line no-unused-expressions
            expect(err.message).to.contain('phase');
          }
        });

      });
    });

    describe('Campus/Student association', () => {
      // defined in ../server/models/index.js
      let student1, student2, campus;

      beforeEach(async () => {
        campus = await Campus.create({
          id: 1,
          name: 'Grace Hopper'
        });

        student1 = await Student.create({
          name: 'Terry Witz',
          phase: 'junior',
          campusId: 1
        })

        student2 = await Student.create({
          name: 'Yuval Ivana',
          phase: 'senior',
          campusId: 1
        })
      });

      describe('Campus', () => {
        xit('should have associated students', async () => {
          const result = await campus.hasStudents([student1, student2])
          expect(result).to.be.true; // eslint-disable-line no-unused-expressions
        });
      });

      describe('GET `/api/campuses/:id/students` route', () => {
        xit('should get all students associated with a campus', async () => {
          const response = await agent.get('/api/campuses/1/students').expect(200);
          expect(response.body).to.have.length(2);
          expect(response.body[0].campusId).to.equal(1);
        });
      });
    });
  });

  describe('Front-end', () => {
    const marsCampus = {
      name: 'Mars',
      students: [
        {
          name: 'Amy Wagner',
          phase: 'senior'
        },
        {
          name: 'John Watney',
          phase: 'junior'
        },
        {
          name: 'Marvin Lee',
          phase: 'junior'
        },
        {
          name: 'Valentine Michael Smith',
          phase: 'senior'
        }
      ]
    };

    // defined in ../client/components/SingleCampus.js
    describe('<SingleCampus /> component', () => {
      const renderedMarsCampus = shallow(
        <SingleCampus
          campus={marsCampus}
          students={marsCampus.students}
        />
      );

      // change campus name to test dynamic rendering
      marsCampus.name = 'Red Planet';
      // remove first item to render different list of students
      const firstStudent = marsCampus.students.shift();
      const renderedRedPlanetCampus = shallow(
        <SingleCampus
          campus={marsCampus}
          students={marsCampus.students}
        />
      );

      // reset campus name
      marsCampus.name = 'Mars';
      // put first student back
      marsCampus.students.unshift(firstStudent);

      xit('should render the name of the campus in an h2', () => {
        expect(renderedMarsCampus.find('h2').text()).to.equal('Mars');
        expect(renderedRedPlanetCampus.find('h2').text()).to.equal('Red Planet');
      });

      xit('should render a list of <SingleStudent /> components with the student passed in', () => {
        const renderedMarsStudents = renderedMarsCampus.find(SingleStudent);
        expect(renderedMarsStudents.length).to.equal(4);
        expect(renderedMarsStudents.get(2).props.student.name).to.equal('Marvin Lee');

        const renderedRedPlanetStudents = renderedRedPlanetCampus.find(SingleStudent);
        expect(renderedRedPlanetStudents.length).to.equal(3);
        expect(renderedRedPlanetStudents.get(2).props.student.name).to.equal('Valentine Michael Smith');
      });
    });

    describe('Redux', () => {
      describe('action creators', () => {
        // defined in ../client/redux/actions.js

        const campuses = [
          { name: 'New York' },
          { name: 'Chicago' },
          { name: 'Pluto' }
        ];

        let mock;
        beforeEach(() => {
          mock = new MockAdapter(axios)
        })

        afterEach(() => {
          mock.reset();
        })

        xit('should allow synchronous creation of SELECT_CAMPUS actions', () => {
          const selectCampusAction = selectCampus(marsCampus);
          expect(selectCampusAction.type).to.equal(SELECT_CAMPUS);
          expect(selectCampusAction.campus).to.equal(marsCampus);
        });


        xit('fetchCampuses() returns a thunk to fetch campuses from the backend and dispatch a SET_CAMPUSES action', async () => {
          mock.onGet('/api/campuses').replyOnce(200, campuses);
          await store.dispatch(fetchCampuses())
          const actions = store.getActions();
          expect(actions[0].type).to.equal('SET_CAMPUSES');
          expect(actions[0].campuses).to.deep.equal(campuses);
        });
      });

      describe('reducer', () => {
        // defined in ../client/redux/reducer.js

        xit('returns a new state with selected campus', () => {
          const newState = reducer(
            initialState,
            {
              type: SELECT_CAMPUS,
              campus: marsCampus
            }
          );
          expect(newState.selectedCampus).to.equal(marsCampus);
          expect(initialState.selectedCampus).to.deep.equal({});
        });
      });
    });
  });

  // defined in ../utils/index.js
  /*
    One thing we'd like for each campus is to generate groups of students.
    Although for now we won't be integrating this into our end user view, we'd like for you to address the functionality.
    Write a function that will take in an array of strings, representing student names, and the size of groups to be made (number).
    This `generateGroups` function will return an array of arrays of student groups.
    All students that may not fit evenly into the expected length of groups will be placed in their own group.
  */

  describe('`generateGroups` utility method', () => {
    xit('takes an array and a number (size) and returns an array', () => {
      const groupsA = utils.generateGroups(['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'], 1);
      expect(groupsA).to.be.an('array');
      const groupsB = utils.generateGroups(['types', {dont: 'matter'}, 0], 3);
      expect(groupsB).to.be.an('array');
    });

    xit('groups the input array elements into nested arrays of the given size, such that the nested arrays contain the original elements in the original order', () => {
      const groupsA = utils.generateGroups(['a', 'b', 'c', 'd'], 2);
      expect(groupsA).to.deep.equal([['a', 'b'], ['c', 'd']]);
      const groupsB = utils.generateGroups(['up', 'charm', 'top', 'down', 'strange', 'bottom'], 3);
      expect(groupsB).to.deep.equal([['up', 'charm', 'top'], ['down', 'strange', 'bottom']]);
    });

    xit('handles inexact multiples by putting the remainder in the last group', () => {
      const groupsA = utils.generateGroups([{id: 5}, {id: 10}, {id: 20}], 2);
      // by the way, any objects in the input array can be added into the groups by reference, no need to copy / clone them
      expect(groupsA).to.deep.equal([[{id: 5}, {id: 10}], [{id: 20}]]);
      const groupsB = utils.generateGroups(['do', 're', 'me', 'fa', 'sol', 'la', 'ti', 'do'], 3);
      expect(groupsB).to.deep.equal([['do', 're', 'me'], ['fa', 'sol', 'la'], ['ti', 'do']]);
    });
  });
});
