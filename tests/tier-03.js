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
import { shallow } from 'enzyme';
import { CampusInput } from '../client/components/CampusInput'

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
        name: 'Grace Hopper'
      });
      await Student.create({
        name: 'Terry Witz',
        phase: 'junior',
        campusId: graceHopperCampus.id
      });
      await Student.create({
        name: 'Yuval Ivana',
        phase: 'senior',
        campusId: graceHopperCampus.id
      });
    });

    describe('Student', () => {
      describe('Class method `findByPhase`', () => {
        // defined in ../server/models/Student.js

        xit('finds all students belonging to a certain phase', async () => {
          const students = await Student.findByPhase('junior')
          expect(students.length).to.be.equal(1);
          expect(students[0].name).to.be.equal('Terry Witz');
        })
      })
    })

    describe('Campus', () => {

      describe('GET `/api/campuses/:id` route enhanced', () => {
        // defined in ../server/routes/campuses.js

        xit('populates (eager-load) the student information for the found campus', async () => {
          const response = await agent.get('/api/campuses/1').expect(200);
          expect(response.body.students.length).to.equal(2);
          expect(response.body.students[0].name).to.exist;
        })
      })

      describe('POST `/api/campuses/` route', () => {
        xit('creates a campus', async () => {
          // defined in ../server/routes/campuses.js

          const response = await agent.post('/api/campuses')
            .send({
              name: 'Fullstack Remote Campus'
            })
            .expect(201);
          const createdCampus = await Campus.findById(response.body.id);
          expect(createdCampus.name).to.be.equal('Fullstack Remote Campus');
        });
      });

      describe('POST `/api/campuses/:id/students` route', () => {
        // defined in ../server/routes/campuses.js

        xit('creates a student associated with the campus indicated by the route', async () => {
          const response = await agent.post('/api/campuses/1/students')
            .send({
              name: 'Karley Remoteson',
              phase: 'junior'
            })
            .expect(201);
          const createdStudent = await Student.findById(response.body.id);
          expect(createdStudent.name).to.be.equal('Karley Remoteson');
          expect(createdStudent.campusId).to.be.equal(1);
        });
      });
    })
  })

  describe('front end', () => {
    describe('<CampusInput /> component', () => {
      // defined in ../client/components/CampusInput.js

      let renderedCampusInput;
      let campusInputInstance;
      beforeEach(() => {
        renderedCampusInput = shallow(<CampusInput />);
        campusInputInstance = renderedCampusInput.instance();
      })

      xit('is a class component with an initial local state', () => {
        expect(campusInputInstance).to.exist;
        expect(campusInputInstance.state).to.eql({name: ''});
      })

      xit('renders an <input /> element', () => {
        expect(renderedCampusInput.find('input').node).to.exist;
      })

      xit('has a method called `handleChange` that is invoked when there is a change event triggered by the <input /> element', () => {
        expect(typeof campusInputInstance.handleChange).to.equal('function')
        const handleChangeSpy = sinon.spy()
        campusInputInstance.handleChange = handleChangeSpy;
        renderedCampusInput.setState({})
        renderedCampusInput.find('input').simulate('change', {
          target: { value: 'A New Campus Name' }
        })
        expect(handleChangeSpy.calledOnce).to.equal(true);
      })

      xit('`handleChange` updates the local state', () => {
        renderedCampusInput.find('input').simulate('change', {
          target: { value: 'Another Campus Name' }
        })
        expect(campusInputInstance.state.name).to.equal('Another Campus Name')
      })

    })

    describe('redux store', () => {

      describe('action creators', () => {
        // defined in ../client/redux/actions.js

        const starfleetCampus = {id: 1, name: 'Starfleet Academy'}

        let mock;
        before(() => {
          mock = new MockAdapter(axios)
        })

        afterEach(() => {
          mock.reset();
        })

        after(() => {
          mock.restore();
        })

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

            await store.dispatch(postCampus(starfleetCampus))
            const actions = store.getActions();
            expect(actions[0].type).to.equal('ADD_CAMPUS');
            expect(actions[0].campus).to.deep.equal(starfleetCampus);
            await Campus.findById(1)
          });

        });

      })

      describe('reducer', () => {
          // defined in ../client/redux/reducer.js

        xit('returns a new state with the newly created campus added to the list of campuses', () => {
          const remoteCampus = {id: 1, name: 'Fullstack Remote Campus'}
          const starfleetCampus = {id: 2, name: 'Starfleet Academy'}
          initialState.campuses = [remoteCampus];

          const newState = reducer(
            initialState,
            {
              type: ADD_CAMPUS,
              campus: starfleetCampus
            }
          );
          expect(newState.campuses.length).to.equal(2);
          expect(newState.campuses.find((campus => campus.name === 'Starfleet Academy'))).to.deep.equal(starfleetCampus);
          expect(newState.students).to.equal(initialState.students);
          expect(newState.selectedCampus).to.equal(initialState.selectedCampus);
        });
      })
    })
  })

  // defined in ../utils/index.js
  /*
    When we go to generate groups of students, the processing is very slow.
    Therefore, an end user may not realize the time it takes, and click the 'Generate Pairs' button time and time again, thinking it's not working.
    To counter this, we essentially want to LIMIT how often a function can run per unit time.
    Write a `throttle` method that will wrap a function and a throttle time (t).
    This wrapped function will only run the original function once for every unit t.
    Subsequent function calls within this period will be ignored until the period (t) expires.
  */

  describe('`throttle` utility method', () => {
    xit('takes a function and a number (throttle time - in milliseconds) and returns a throttled function', () => {
      const funcToThrottle = (name) => {
        console.log(`What up ${name}`);
      }
      const throttleTime = 50;
      const throttledFunction = utils.throttle(funcToThrottle, throttleTime);
      expect(throttledFunction).to.be.a('function');
    });

    describe('returned throttled function', () => {

      xit('runs the original function and upon invocation passes it the same arguments', () => {
        const spiedFunction = chai.spy();
        const throttleTime = 50;
        const throttledFunction = utils.throttle(spiedFunction, throttleTime);
        // `throttle` itself does not call the original function
        expect(spiedFunction).not.to.have.been.called;
        throttledFunction(1, 'omri', 'polar bear');
        // calling the throttled function (the result of `throttle`) calls the original function
        expect(spiedFunction).to.have.been.called.once;
        expect(spiedFunction).to.have.been.called.with.exactly(1, 'omri', 'polar bear');
      })

      xit('ensures that multiple function calls within the throttling period will not invoke the original function', (done) => {
        const spiedFunction = chai.spy();
        const throttleTime = 50;
        const throttledFunction = utils.throttle(spiedFunction, throttleTime);
        expect(spiedFunction).not.to.have.been.called;
        throttledFunction();
        expect(spiedFunction).to.have.been.called.once;
        throttledFunction();
        throttledFunction();
        // wait period has not been long enough, so the original function is not called a second time
        expect(spiedFunction).to.have.been.called.once;
        setTimeout(() => {
          throttledFunction();
          throttledFunction();
          // wait period still has not been long enough, so the original function is not called a second time
          expect(spiedFunction).to.have.been.called.once;
          setTimeout(() => {
            // previous invocations of the throttled function do NOT trigger the original to be called later
            expect(spiedFunction).to.have.been.called.once;
            done();
          }, 70);
        }, 40);
      });

      xit('can invoke the original function after the throttling period is over', (done) => {
        const spiedFunction = chai.spy();
        const throttleTime = 50;
        const throttledFunction = utils.throttle(spiedFunction, throttleTime);
        throttledFunction();
        setTimeout(() => {
          throttledFunction();
          // wait period has been long enough, so the original function is called a second time
          expect(spiedFunction).to.have.been.called.twice;
          throttledFunction();
          // wait period has not been long enough, so the original function is NOT called a third time
          expect(spiedFunction).to.have.been.called.twice;
          setTimeout(() => {
            throttledFunction();
            // wait period has been long enough, so the original function is called a third time
            expect(spiedFunction).to.have.been.called.exactly(3);
            setTimeout(() => {
              // previous invocations of the throttled function do NOT trigger the original to be called later
              expect(spiedFunction).to.have.been.called.exactly(3);
              done();
            }, 60);
          }, 60);
        }, 60);
      });

    });

  });
})
