'use strict';

// Assertions
const chai = require('chai');
const expect = chai.expect;
const chaiThings = require('chai-things');
chai.use(chaiThings);

// Campus Model
const db = require('../server/models');
const Campus = db.model('campus');

// Campus Routes
const app = require('../server/app');
const agent = require('supertest')(app);

// CampusList component
import { shallow } from 'enzyme';
import React from 'react';
import CampusList from '../client/components/CampusList';

// Redux
import { SET_CAMPUSES } from '../client/redux/constants';
import { setCampuses } from '../client/redux/actions';
import reducer from '../client/redux/reducer';

describe('Tier One', () => {
  before(() => db.sync({ force: true }));
  after(() => db.sync({ force: true }));

  // defined in ../server/models/Campus.js
  describe('Campus model', () => {
    describe('Validations', () => {
      xit('requires name', () => {
        const campus = Campus.build();

        return campus.validate()
        .then(() => {
          throw Error('validation was successful but should have failed without `name`');
        }, err => {
          expect(err.message).to.contain('name cannot be null');
        });
      });

      xit('requires name to not be an empty string', () => {
        const campus = Campus.build({
          name: ''
        });

        return campus.validate()
        .then(() => {
          throw Error('validation was successful but should have failed if name is an empty string');
        }, err => {
          expect(err.message).to.contain('Validation error');
        });
      });
    });
  });

  // defined in ../server/routes/campuses.js
  describe('Campus routes', () => {
    let storedCampuses;

    const campusData = [
      {
        name: 'Grace Hopper'
      },
      {
        name: 'Fullstack Academy'
      }
    ];

    before(() =>
      Campus.bulkCreate(campusData)
      .then(createdCampuses => {
        storedCampuses = createdCampuses.map(campus => campus.dataValues);
      })
    );

    // Route for fetching all campuses
    describe('GET /api/campuses', () => {
      xit('serves up all Campuses', () => {
        return agent
        .get('/api/campuses')
        .expect(200)
        .then(response => {
          expect(response.body).to.have.length(2);
          expect(response.body[0].name).to.equal(storedCampuses[0].name);
        });
      });
    });

    // Route for fetching a single campus
    describe('GET /api/campuses/:id', () => {
      xit('serves up a single Campus by its id', () => {
        return agent
        .get('/api/campuses/1')
        .expect(200)
        .then(response => {
          expect(response.body.name).to.equal('Grace Hopper');
        });
      });
    });
  });


  describe('Front-End', () => {
    const campuses = [
      { name: 'New York' },
      { name: 'Chicago' },
      { name: 'Pluto' }
    ];

    // defined in ../client/components/CampusList.js
    describe('<CampusList /> component', () => {
      xit('renders an unordered list', () => {
        const wrapper = shallow(<CampusList campuses={[]} />);
        expect(wrapper.find('ul')).to.have.length(1);
      })

      xit('renders list items for the campuses passed in as props', () => {

        return Campus.bulkCreate(campuses)
        .then(() => {
          //we are creating the campuses in the database so the extra credit in tier-4 doesn't break this spec.
          const wrapper = shallow(<CampusList campuses={campuses} />);
          const listItems = wrapper.find('li');
          expect(listItems).to.have.length(3);
          expect(listItems.at(2).text()).to.contain('Pluto');
        })
      });
    });

    // defined in ../client/redux/actions.js
    describe('`setCampuses` action creator', () => {
      const setCampusesAction = setCampuses(campuses);

      xit('returns a Plain Old JavaScript Object', () => {
        expect(typeof setCampusesAction).to.equal('object');
        expect(Object.getPrototypeOf(setCampusesAction)).to.equal(Object.prototype);
      });

      xit('creates an object with `type` and `campuses`', () => {
        expect(setCampusesAction.type).to.equal(SET_CAMPUSES);
        expect(Array.isArray(setCampusesAction.campuses)).to.be.true;
        expect(setCampusesAction.campuses[2].name).to.equal('Pluto');
      });

    });

    // defined in ../client/redux/reducer.js
    describe('reducer', () => {
      const initialState = {
        campuses: []
      };

      const newState = reducer(
        initialState,
        {
          type: SET_CAMPUSES,
          campuses: campuses
        }
      )

      xit('returns a new state with the updated campuses', () => {
        expect(newState.campuses).to.equal(campuses);
      });

      xit('does not modify the previous state', () => {
        expect(initialState).to.deep.equal({
          campuses: []
        });
      });

    });
  });

});

