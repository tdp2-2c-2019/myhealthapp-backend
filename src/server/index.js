const express = require('express');
const db = require('./db');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use('/api/users', require('./users/users'));

app.get('/api/getUsername', (req, res, next) => {
  db.query('SELECT * FROM plans;', [], (err, result) => {
    if (err) {
      return next(err);
    }
    res.send({ username: result.rows[0].name });
  });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
