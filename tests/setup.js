/* DO NOT EDIT */

const db = require('../server/models');
before(() => db.sync({ force: true }));
afterEach(() => db.sync({ force: true }));
after(() => db.close())
