'use strict';

const db = require('../server/models');
const Campus = db.model('campus');
const chai = require('chai');
const expect = chai.expect;
const chaiThings = require('chai-things');
chai.use(chaiThings);
const enzyme = require('enzyme');
const shallow = enzyme.shallow;
const React = require('react');
import CampusList from '../react/components/CampusList';
import { CAMPUSES_RECEIVED } from '../react/redux/constants';
import { setCampuses } from '../react/redux/actions';
import reducer from '../react/redux/reducer';

const app = require('../server/app');
const agent = require('supertest')(app);

describe('Tier One', () => {
  before(() => db.sync({ force: true }));

  after(() => db.sync({ force: true }));

  // Campus model (requires name)
  describe('Campus model', () => {
    describe('Validations', () => {
      it('requires name', () => {
        const campus = Campus.build();

        return campus.validate()
        .then(() => {
          throw Error('validation was successful but should have failed without `name`');
        }, err => {
          expect(err.message).to.contain('name cannot be null');
        });
      });
    });
  });

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
    describe('GET /campuses', () => {
      it('serves up all Campuses', () => {
        return agent
        .get('/campuses')
        .expect(200)
        .then(response => {
          expect(response.body).to.have.length(2);
          expect(response.body[0].name).to.equal(storedCampuses[0].name);
        });
      });
    });

    // Route for fetching a single campus
    describe('GET /campuses/:id', () => {
      it('serves up a single Campus by its id', () => {
        return agent
        .get('/campuses/1')
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

    // Component CampusList (componentDidMount)
    describe('<CampusList /> component', () => {
      it('renders an unordered list', () => {
        const wrapper = shallow(<CampusList />);
        expect(wrapper.find('ul')).to.have.length(1);
      })

      it('renders list items for the campuses passed in as props', () => {

        const wrapper = shallow(<CampusList campuses={campuses} />);
        const listItems = wrapper.find('li');
        expect(listItems).to.have.length(3);
        expect(listItems.at(2).text()).to.contain('Pluto');
      });
    });

    // Synchronous action creator to be used within thunk that AJAXs for all campuses
    describe('`setCampuses` action creator', () => {
      const setCampusesAction = setCampuses(campuses);

      it('returns a Plain Old JavaScript Object', () => {
        expect(typeof setCampusesAction).to.equal('object');
        expect(Object.getPrototypeOf(setCampusesAction)).to.equal(Object.prototype);
      });

      it('creates an object with `type` and `campuses`', () => {
        expect(setCampusesAction.type).to.equal(CAMPUSES_RECEIVED);
        expect(Array.isArray(setCampusesAction.campuses)).to.be.true;
        expect(setCampusesAction.campuses[2].name).to.equal('Pluto');
      });

    });

    describe('reducer', () => {
      const initialState = {
        campuses: []
      };

      const newState = reducer(
        initialState,
        {
          type: CAMPUSES_RECEIVED,
          campuses: campuses
        }
      )

      it('returns a new state with the updated campuses', () => {
        expect(newState.campuses).to.equal(campuses);
      });

      it('does not modify the previous state', () => {
        expect(initialState).to.deep.equal({
          campuses: []
        });
      });

    });
  });

});

