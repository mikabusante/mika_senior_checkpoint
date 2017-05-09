const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost:5432/checkpoint_senior_tiers', {
    logging: false
});

module.exports = db;
