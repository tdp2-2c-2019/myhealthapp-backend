const express = require('express');
const db = require('./db');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use('/api/users', require('./users/users').default);

app.get('/api/getUsername', (req, res, next) => {
  db.query('SELECT * FROM plans;', [], (err, result) => {
    if (err) {
      return next(err);
    }
    res.send({ username: result.rows[0].name });
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).send({ error: err.message || 'Internal server error' });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
