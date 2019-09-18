import { HandlerGenerator, checkToken } from './middleware/jwt';

require('dotenv').config();
const express = require('express');
const { db } = require('./db');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/api/users', checkToken, require('./users/users').default);

app.post('/api/login', HandlerGenerator.login);

app.get('/api/plans', (req, res, next) => {
  db.select().from('plans').then(plans => res.send(plans)).catch(err => next(err));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).send({ error: err.message || 'Internal server error' });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
