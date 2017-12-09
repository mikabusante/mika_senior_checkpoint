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
import { SELECT_CAMPUS, SET_STUDENTS } from '../client/redux/constants';
import { fetchCampuses, selectCampus, setStudents } from '../client/redux/actions';

describe('Tier Two', () => {
  describe('Back-end', () => {
    before(() => db.sync({ force: true }));
    after(() => db.sync({ force: true }));

    // defined in ../server/models/Student.js
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
          student.name = "Mariya Dova"
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
      // defined in ../server/models/index.js
      let student1, student2, campus;

      before(() => Promise.all([
          Campus.create({
            id: 1,
            name: 'Grace Hopper'
          }),
          Student.create({
            name: 'Terry Witz',
            phase: 'junior',
            campusId: 1
          }),
          Student.create({
            name: 'Yuval Ivana',
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
          return agent.get('/api/campuses/1/students')
          .expect(200)
          .then(res => {
            expect(res.body).to.have.length(2);
            expect(res.body[0].campusId).to.equal(1);
          });
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

      it('should render the name of the campus in an h2', () => {
        expect(renderedMarsCampus.find('h2').text()).to.equal('Mars');
        expect(renderedRedPlanetCampus.find('h2').text()).to.equal('Red Planet');
      });

      it('should render a list of <SingleStudent /> components', () => {
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
        before(() => {
          mock = new MockAdapter(axios)
        })

        afterEach(() => {
          mock.reset();
        })

        after(() => {
          mock.restore();
        })

        it('should allow synchronous creation of SELECT_CAMPUS actions', () => {
          const selectCampusAction = selectCampus(marsCampus);
          expect(selectCampusAction.type).to.equal(SELECT_CAMPUS);
          expect(selectCampusAction.campus).to.equal(marsCampus);
        });


        it('fetchCampuses() returns a thunk to fetch campuses from the backend and dispatch a SET_CAMPUSES action', () => {
          mock.onGet('/api/campuses').replyOnce(200, campuses);
          return store.dispatch(fetchCampuses())
          .then(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.equal('SET_CAMPUSES');
            expect(actions[0].campuses).to.deep.equal(campuses);
          })
        });
      });

      describe('reducer', () => {
        // defined in ../client/redux/reducer.js

        it('returns a new state with selected campus', () => {
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
});
