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
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
enzyme.configure({
  adapter: new Adapter(),
});
import SingleCampus from '../client/components/SingleCampus';
import SingleStudent from '../client/components/SingleStudent';

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
  students: [],
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

        xit('requires `name`', async () => {
          try {
            await student.validate();
            throw new Error('Validation succeeded but should have failed');
          } catch (err) {
            expect(err.message).to.contain('name');
          }
        });

        xit('requires `phase` property to be either NULL, "junior", or "senior" (nothing else)', async () => {
          student.name = 'Mariya Dova';

          // confirming these work fine
          await student.save();
          student.phase = 'junior';
          await student.save();
          student.phase = 'senior';
          await student.save();

          // confirming this doesn't work at all
          try {
            student.phase = 'super';
            await student.save();
          } catch (err) {
            expect(err).to.exist;
            expect(err.message).to.contain('phase');
            return; // everything is fine, so stop this spec.
          }

          // if we got here, that means we DIDN'T fail above, which is wrong.
          throw Error(
            'Trying to `save` a student with invalid `phase` should have failed.'
          );
        });
      });
    });

    describe('Campus/Student association', () => {
      // defined in ../server/models/index.js
      let student1, student3, campus1;

      beforeEach(async () => {
        campus1 = await Campus.create({
          id: 1,
          name: 'Grace Hopper',
        });

        await Campus.create({
          id: 2,
          name: 'Flex',
        });

        student1 = await Student.create({
          name: 'Terry Witz',
          phase: 'junior',
          campusId: 1,
        });

        await Student.create({
          name: 'Gaby Medina',
          phase: 'senior',
          campusId: 2,
        });

        student3 = await Student.create({
          name: 'Yuval Ivana',
          phase: 'senior',
          campusId: 1,
        });
      });

      describe('Campus', () => {
        xit('has associated students', async () => {
          const result = await campus1.hasStudents([student1, student3]);
          expect(result).to.be.true;
        });
      });

      describe('GET `/api/campuses/:id/students` route', () => {
        xit('gets all students associated with a campus', async () => {
          const response = await agent
            .get('/api/campuses/1/students')
            .expect(200);
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
          phase: 'senior',
        },
        {
          name: 'John Watney',
          phase: 'junior',
        },
        {
          name: 'Marvin Lee',
          phase: 'junior',
        },
        {
          name: 'Valentine Michael Smith',
          phase: 'senior',
        },
      ],
    };

    // defined in ../client/components/SingleCampus.js
    describe('<SingleCampus /> component', () => {
      const renderedMarsCampus = shallow(
        <SingleCampus campus={marsCampus} students={marsCampus.students} />
      );

      // change campus name to test dynamic rendering
      marsCampus.name = 'Red Planet';
      // remove first item to render different list of students
      const firstStudent = marsCampus.students.shift();
      const renderedRedPlanetCampus = shallow(
        <SingleCampus campus={marsCampus} students={marsCampus.students} />
      );

      // reset campus name
      marsCampus.name = 'Mars';
      // put first student back
      marsCampus.students.unshift(firstStudent);

      xit('renders the name of the campus in an <h2>, which should be inside a <div>', () => {
        expect(renderedMarsCampus.find('h2').text()).to.equal('Mars');
        expect(renderedRedPlanetCampus.find('h2').text()).to.equal(
          'Red Planet'
        );
      });

      // NOTE: The <SingleStudent /> component should take a prop called `student`, which is the student to render
      xit('renders a list of <SingleStudent /> components with the student passed in, inside of the same <div> as the <h2> name of the campus', () => {
        const renderedMarsStudents = renderedMarsCampus.find(SingleStudent);
        expect(renderedMarsStudents.length).to.equal(4);
        expect(renderedMarsStudents.get(2).props.student.name).to.equal(
          'Marvin Lee'
        );

        const renderedRedPlanetStudents = renderedRedPlanetCampus.find(
          SingleStudent
        );
        expect(renderedRedPlanetStudents.length).to.equal(3);
        expect(renderedRedPlanetStudents.get(2).props.student.name).to.equal(
          'Valentine Michael Smith'
        );
      });
    });

    describe('Redux', () => {
      const campuses = [
        { name: 'New York' },
        { name: 'Chicago' },
        { name: 'Pluto' },
      ];

      let mock;
      beforeEach(() => {
        mock = new MockAdapter(axios);
      });

      afterEach(() => {
        mock.reset();
      });

      describe('selecting a campus', () => {
        describe('`selectCampusAction` action creator', () => {
          // defined in ../client/redux/actions.js

          xit('creates SELECT_CAMPUS actions', () => {
            const selectCampusAction = selectCampus(marsCampus);
            expect(selectCampusAction.type).to.equal(SELECT_CAMPUS);
            expect(selectCampusAction.campus).to.equal(marsCampus);
          });
        });

        describe('reducer', () => {
          // defined in ../client/redux/reducer.js

          xit('returns an immutably-updated new state with selected campus', () => {
            const newState = reducer(initialState, {
              type: SELECT_CAMPUS,
              campus: marsCampus,
            });
            expect(newState.selectedCampus).to.equal(marsCampus);
            expect(initialState.selectedCampus).to.deep.equal({});
            // these shouldn't have changed:
            expect(newState.campuses).to.equal(initialState.campuses);
            expect(newState.students).to.equal(initialState.students);
          });
        });
      });

      describe('setting multiple campuses', () => {
        describe('`fetchCampuses` thunk creator', () => {
          // defined in ../client/redux/actions.js

          xit('returns a thunk to fetch campuses from the backend and dispatch a SET_CAMPUSES action', async () => {
            mock.onGet('/api/campuses').replyOnce(200, campuses);
            await store.dispatch(fetchCampuses());
            const actions = store.getActions();
            expect(actions[0].type).to.equal('SET_CAMPUSES');
            expect(actions[0].campuses).to.deep.equal(campuses);
          });
        });
      });
    });
  });

  // One of our upstream APIs is busted. It's supposed to return a nice object with keys and values. Instead, it's spitting out key-value pairs in an array where keys are the odd elements of the input array and the corresponding values are the even elements of the input array
  //
  // Write a function that can take an array of successive key-value pairs and turn it into a nice little object, where the zeroth element is the first key and the element right after it is the first value. See the examples below:
  describe('`makeObjectFromArray` utility method', () => {
    xit('takes an array and returns an object', () => {
      const output = utils.makeObjectFromArray([]);
      expect(output).to.be.an('object');
    });
    xit('Turns successive pairs of array elements into key-value pairs in the object', () => {
      const output1 = utils.makeObjectFromArray([]);
      expect(output1).to.deep.equal({});

      const output2 = utils.makeObjectFromArray([
        'height',
        189,
        'weight',
        203,
        'affiliation',
        'Rebel Alliance',
      ]);
      expect(output2).to.deep.equal({
        height: 189,
        weight: 203,
        affiliation: 'Rebel Alliance',
      });
    });
  });
});
