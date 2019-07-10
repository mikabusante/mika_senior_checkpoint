const chai = require('chai');
const expect = chai.expect;
const chaiThings = require('chai-things');
const chaiSpies = require('chai-spies');
const sinon = require('sinon');
chai.use(chaiThings);
chai.use(chaiSpies);

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
enzyme.configure({ adapter: new Adapter() });
import { CampusInput } from '../client/components/CampusInput';

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
import { ADD_CAMPUS } from '../client/redux/constants';
import { postCampus, addCampus } from '../client/redux/actions';

// Utils
const utils = require('../utils');

describe('Tier Three', () => {
  describe('Back-end', () => {
    beforeEach(async () => {
      const graceHopperCampus = await Campus.create({
        name: 'Grace Hopper',
      });
      await Student.create({
        name: 'Terry Witz',
        phase: 'junior',
        campusId: graceHopperCampus.id,
      });
      await Student.create({
        name: 'Yuval Ivana',
        phase: 'senior',
        campusId: graceHopperCampus.id,
      });
    });

    describe('Student', () => {
      describe('Class method `findByPhase`', () => {
        // defined in ../server/models/Student.js

        xit('finds all students belonging to a certain phase', async () => {
          const students = await Student.findByPhase('junior');
          expect(students.length).to.be.equal(1);
          expect(students[0].name).to.be.equal('Terry Witz');
        });
      });
    });

    describe('Campus', () => {
      describe('GET `/api/campuses/:id` route enhanced', () => {
        // defined in ../server/routes/campuses.js

        xit('populates (eager-load) the student information for the found campus', async () => {
          const response = await agent.get('/api/campuses/1').expect(200);
          expect(response.body.students.length).to.equal(2);
          expect(response.body.students[0].name).to.exist;
        });
      });

      describe('POST `/api/campuses/` route', () => {
        xit('responds with a created campus', async () => {
          // defined in ../server/routes/campuses.js

          const response = await agent
            .post('/api/campuses')
            .send({
              name: 'Fullstack Remote Campus',
            })
            .expect(201);
          const createdCampus = await Campus.findById(response.body.id);
          expect(createdCampus.name).to.be.equal('Fullstack Remote Campus');
        });
      });

      describe('POST `/api/campuses/:id/students` route', () => {
        // defined in ../server/routes/campuses.js

        xit('responds with a created student, associated with the campus indicated by the route', async () => {
          const response = await agent
            .post('/api/campuses/1/students')
            .send({
              name: 'Karley Remoteson',
              phase: 'junior',
            })
            .expect(201);
          const createdStudent = await Student.findById(response.body.id);
          expect(createdStudent.name).to.be.equal('Karley Remoteson');
          expect(createdStudent.campusId).to.be.equal(1);
        });
      });
    });
  });

  describe('front end', () => {
    describe('<CampusInput /> component', () => {
      // defined in ../client/components/CampusInput.js

      let renderedCampusInput;
      let campusInputInstance;
      beforeEach(() => {
        renderedCampusInput = shallow(<CampusInput />);
        campusInputInstance = renderedCampusInput.instance();
      });

      xit('is a class component with an initial local state', () => {
        expect(campusInputInstance).to.exist;
        expect(campusInputInstance.state).to.eql({ name: '' });
      });

      xit('renders an <input /> element', () => {
        expect(renderedCampusInput.find('input').getElement()).to.exist;
      });

      xit('has a method called `handleChange` that is invoked when there is a change event triggered by the <input /> element', () => {
        expect(typeof campusInputInstance.handleChange).to.equal('function');
        const handleChangeSpy = sinon.spy();
        campusInputInstance.handleChange = handleChangeSpy;
        renderedCampusInput.setState({});
        renderedCampusInput.find('input').simulate('change', {
          target: { value: 'A New Campus Name' },
        });
        expect(handleChangeSpy.calledOnce).to.equal(true);
      });

      xit('`handleChange` updates the local state', () => {
        renderedCampusInput.find('input').simulate('change', {
          target: { value: 'Another Campus Name' },
        });
        expect(campusInputInstance.state.name).to.equal('Another Campus Name');
      });
    });

    describe('redux store', () => {
      describe('action creators', () => {
        // defined in ../client/redux/actions.js

        const starfleetCampus = { id: 1, name: 'Starfleet Academy' };

        let mock;
        before(() => {
          mock = new MockAdapter(axios);
        });

        afterEach(() => {
          mock.reset();
        });

        after(() => {
          mock.restore();
        });

        describe('`addCampusAction`', () => {
          xit('creates an ADD_CAMPUS action', () => {
            const addCampusAction = addCampus(starfleetCampus);
            expect(addCampusAction.type).to.equal(ADD_CAMPUS);
            expect(addCampusAction.campus).to.eql(starfleetCampus);
          });
        });

        describe('`postCampus`', () => {
          xit('returns a thunk to post a new campus to the backend and dispatch an ADD_CAMPUS action', async () => {
            mock.onPost('/api/campuses').replyOnce(201, starfleetCampus);

            await store.dispatch(postCampus(starfleetCampus));
            const actions = store.getActions();
            expect(actions[0].type).to.equal('ADD_CAMPUS');
            expect(actions[0].campus).to.deep.equal(starfleetCampus);
            await Campus.findById(1);
          });
        });
      });

      describe('reducer', () => {
        // defined in ../client/redux/reducer.js

        xit('returns a new state with the newly created campus added to the list of campuses', () => {
          const remoteCampus = { id: 1, name: 'Fullstack Remote Campus' };
          const starfleetCampus = { id: 2, name: 'Starfleet Academy' };
          initialState.campuses = [remoteCampus];

          const newState = reducer(initialState, {
            type: ADD_CAMPUS,
            campus: starfleetCampus,
          });
          expect(newState.campuses.length).to.equal(2);
          expect(
            newState.campuses.find(
              campus => campus.name === 'Starfleet Academy'
            )
          ).to.deep.equal(starfleetCampus);
          expect(newState.students).to.equal(initialState.students);
          expect(newState.selectedCampus).to.equal(initialState.selectedCampus);
        });
      });
    });
  });
  // defined in ../utils/index.js

  /**
   * One thing we'd like for each campus is to generate groups of students.
   * Although for now we won't be integrating this into our end user view,
   * we'd like for you to address the functionality.
   *
   * Write a function that will take in an array (where each element represents
   * a student), and the size of groups to be made (a number). This
   * `generateGroups` function will return an array of arrays of student
   * groups. All students that may not fit evenly into the expected length
   * of groups will be placed in their own group.
   */

  describe('`generateGroups` utility method', () => {
    xit('takes an array and a number (size) and returns an array', () => {
      const groupsA = utils.generateGroups(
        ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
        1
      );
      expect(groupsA).to.be.an('array');
      const groupsB = utils.generateGroups(
        [
          'types',
          {
            dont: 'matter',
          },
          0,
        ],
        3
      );
      expect(groupsB).to.be.an('array');
    });

    xit('groups the input array elements into nested arrays of the given size, such that the nested arrays contain the original elements in the original order', () => {
      const groupsA = utils.generateGroups(['a', 'b', 'c', 'd'], 2);
      expect(groupsA).to.deep.equal([['a', 'b'], ['c', 'd']]);
      const groupsB = utils.generateGroups(
        ['up', 'charm', 'top', 'down', 'strange', 'bottom'],
        3
      );
      expect(groupsB).to.deep.equal([
        ['up', 'charm', 'top'],
        ['down', 'strange', 'bottom'],
      ]);
    });

    xit('handles inexact multiples by putting the remainder in the last group', () => {
      const groupsA = utils.generateGroups(
        [
          {
            id: 5,
          },
          {
            id: 10,
          },
          {
            id: 20,
          },
        ],
        2
      );
      // by the way, any objects in the input array can be added into the groups by reference, no need to copy / clone them
      expect(groupsA).to.deep.equal([
        [
          {
            id: 5,
          },
          {
            id: 10,
          },
        ],
        [
          {
            id: 20,
          },
        ],
      ]);
      const groupsB = utils.generateGroups(
        ['do', 're', 'me', 'fa', 'sol', 'la', 'ti', 'do'],
        3
      );
      expect(groupsB).to.deep.equal([
        ['do', 're', 'me'],
        ['fa', 'sol', 'la'],
        ['ti', 'do'],
      ]);
    });
  });
});
