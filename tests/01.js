'use strict';

const db = require('../server/models');
const Campus = db.model('campus');
const chai = require('chai');
const expect = chai.expect;
const chaiThings = require('chai-things');
chai.use(chaiThings);

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

  // Component CampusList (componentDidMount)
  describe('', () => {});

  // Synchronous action creator to be used within thunk that AJAXs for all campuses
  describe('', () => {});

});

