require('dotenv').config();
const express = require('express');
const { db } = require('./db');

const app = express();

app.use(express.static('dist'));
app.get('/api/users', (req, res, next) => {
  db.select().from('users').then(users => res.send(users)).catch(err => next(err));
});

app.get('/api/plans', (req, res, next) => {
  db.select().from('plans').then(plans => res.send(plans)).catch(err => next(err));
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
