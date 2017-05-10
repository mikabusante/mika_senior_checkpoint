'use strict';

const db = require('../server/models');
const Campus = db.model('campus');
const chai = require('chai');
const expect = chai.expect;
const chaiThings = require('chai-things');
chai.use(chaiThings);

const app = require('../server/app')
const agent = require('supertest')(app);

describe('Tier One', () => {
  beforeEach(() => db.sync({ force: true }));

  after(() => db.sync({ force: true }));

  // Campus model (requires name)
  describe('Campus model', () => {
    describe('Validations', () => {
      it('requires name', () => {
        const campus = Campus.build();

        return campus.validate()
        .then(result => {
          expect(result).to.be.an('object');
          expect(result.errors).to.contain.a.thing.with.property('path', 'name');
        });
      });
    });
  });

  // Route for fetching all campuses
  describe('Campus routes', () => {
    describe('GET /campuses', () => {
      it('serves up all Campuses', () => {
        return agent
        .get('/campuses')
        .expect(200)
        .then(response => {
          expect(response.body.campuses).to.have.length(4);
        });
      });
    });
  });

  // Component CampusList (componentDidMount)
  describe('', () => {});

  // Synchronous action creator to be used within thunk that AJAXs for all campuses
  describe('', () => {});

});

