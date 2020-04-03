"use strict";

// Assertions
const chai = require("chai");
const expect = chai.expect;
const chaiThings = require("chai-things");
chai.use(chaiThings);

// Campus Model
const db = require("../server/models");
const Campus = db.model("campus");

// Campus Routes
const app = require("../server/app");
const agent = require("supertest")(app);

// CampusList component
import enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
enzyme.configure({ adapter: new Adapter() });
import React from "react";
import { CampusList } from "../client/components/CampusList";

// Redux
import { SET_CAMPUSES } from "../client/redux/constants";
import { setCampuses } from "../client/redux/actions";
import reducer from "../client/redux/reducer";

// Utils
const utils = require("../utils");

describe("Tier One", () => {
  // defined in ../server/models/Campus.js
  describe("Campus model", () => {
    describe("Validations", () => {
      it("requires `name`", async () => {
        const campus = Campus.build();

        try {
          await campus.validate();
          throw Error(
            "validation was successful but should have failed without `name`"
          );
        } catch (err) {
          expect(err.message).to.contain("name cannot be null");
        }
      });

      it("requires `name` to not be an empty string", async () => {
        const campus = Campus.build({
          name: ""
        });

        try {
          await campus.validate();
          throw Error(
            "validation was successful but should have failed if name is an empty string"
          );
        } catch (err) {
          expect(err.message).to.contain("Validation error");
          /* handle error */
        }
      });
    });
  });

  // defined in ../server/routes/campuses.js
  describe("Campus routes", () => {
    let storedCampuses;

    const campusData = [
      {
        name: "Grace Hopper"
      },
      {
        name: "Fullstack Academy"
      }
    ];

    beforeEach(async () => {
      const createdCampuses = await Campus.bulkCreate(campusData);
      storedCampuses = createdCampuses.map(campus => campus.dataValues);
    });

    // Route for fetching all campuses
    describe("GET `/api/campuses`", () => {
      it("serves up all Campuses", async () => {
        const response = await agent.get("/api/campuses").expect(200);
        expect(response.body).to.have.length(2);
        expect(response.body[0].name).to.equal(storedCampuses[0].name);
      });
    });

    // Route for fetching a single campus
    describe("GET `/api/campuses/:id`", () => {
      it("serves up a single Campus by its `id`", async () => {
        const response = await agent.get("/api/campuses/2").expect(200);
        expect(response.body.name).to.equal("Fullstack Academy");
      });
    });
  });

  describe("Front-End", () => {
    const campuses = [
      { name: "New York" },
      { name: "Chicago" },
      { name: "Pluto" }
    ];
    // defined in ../client/components/CampusList.js
    describe("<CampusList /> component", () => {
      it("renders an unordered list", () => {
        const wrapper = shallow(<CampusList campuses={[]} />);
        expect(wrapper.find("ul")).to.have.length(1);
      });

      it("renders list items for the campuses passed in as props", async () => {
        const campusRecords = await Campus.bulkCreate(campuses);
        //we are creating the campuses in the database so the extra credit in tier-4 doesn't break this spec.
        const wrapper = shallow(<CampusList campuses={campusRecords} />);
        const listItems = wrapper.find("li");
        expect(listItems).to.have.length(3);
        expect(listItems.at(2).text()).to.contain("Pluto");
      });
    });

    // defined in ../client/redux/actions.js
    describe("`setCampuses` action creator", () => {
      const setCampusesAction = setCampuses(campuses);

      it("returns a Plain Old JavaScript Object", () => {
        expect(typeof setCampusesAction).to.equal("object");
        expect(Object.getPrototypeOf(setCampusesAction)).to.equal(
          Object.prototype
        );
      });

      it("creates an object with `type` and `campuses`", () => {
        expect(setCampusesAction.type).to.equal(SET_CAMPUSES);
        expect(Array.isArray(setCampusesAction.campuses)).to.be.true;
        expect(setCampusesAction.campuses[2].name).to.equal("Pluto");
      });
    });

    // defined in ../client/redux/reducer.js
    describe("reducer", () => {
      const initialState = {
        campuses: [],
        selectedCampus: {},
        students: []
      };

      const newState = reducer(initialState, {
        type: SET_CAMPUSES,
        campuses: campuses
      });

      it("returns a new state with the updated `campuses`", () => {
        // this should have changed:
        expect(newState.campuses).to.deep.equal(campuses);
        // this should not have changed:
        expect(newState.selectedCampus).to.equal(initialState.selectedCampus);
        expect(newState.students).to.equal(initialState.students);
      });

      it("does not modify the previous state", () => {
        expect(initialState).to.deep.equal({
          campuses: [],
          selectedCampus: {},
          students: []
        });
      });
    });
  });

  // defined in ../utils/index.js
  /*
    Some of our campus names and even student names may be getting a bit long!
    We want a simple utility function that will produce initials for any string we provide.
    Write the `getInitials` function that takes in a string containing any amount of words.
    Return the initials, capitalized, of each word.
  */

  describe("`getInitials` utility method", () => {
    it("takes a string and returns a string", () => {
      const initials = utils.getInitials("Corey Greenwald");
      expect(initials).to.be.a("string");
    });

    it("returns the first letter of each word in the input string, capitalized", () => {
      const initialsGHA = utils.getInitials("Grace Hopper Academy");
      expect(initialsGHA).to.equal("GHA");
      const initialsHATEOAS = utils.getInitials(
        "hypermedia as the engine of application state"
      );
      expect(initialsHATEOAS).to.equal("HATEOAS");
    });
  });
});
