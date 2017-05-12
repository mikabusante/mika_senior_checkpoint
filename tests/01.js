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

const app = require('../server/app')
const agent = require('supertest')(app);

describe('Tier One', () => {
  beforeEach('Synchronize and clear database', () => {
    db.sync({ force: true });
  });

  // Campus model (requires name)
  describe('Campus model', () => {
    it('requires name', () => {
      const campus = Campus.build();

      return campus.validate()
      .then(err => {
        expect(err).to.be.an('object');
        expect(err.errors).to.contain.a.thing.with.property('path', 'name');
      })
    });
  });

  // Route for fetching all campuses
  describe('Campus route', () => {
    it('serves up all Campuses', () => {
      return agent
      .get('/campuses')
      .expect(200)
      .then(response => {
        expect(response.body).to.have.length(4);
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

