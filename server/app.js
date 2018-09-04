/* DO NOT EDIT */

const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname, '../public')));

const campusesSubRouter = require('./routes/campuses');

app.use('/api/campuses', campusesSubRouter);

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.use((err, req, res, next) => {
    console.error(err, err.stack);
    res.status(500).send(err);
});

module.exports = app;
