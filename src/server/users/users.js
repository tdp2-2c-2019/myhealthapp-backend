const router = require('express').Router();
const db = require('../db');

// Users register with dni, mail and password and we verify against db
router.post('/', (req, res, next) => {
  db.query('select * from users where dni = $1', [req.body.dni], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rowCount === 1) {
      db.query('update users set password = $1, mail = $2 where dni = $3', [req.body.password, req.body.mail, req.body.dni], (err, result) => {
        if (err) {
          return next(err);
        }
        res.status(201).send();
      });
    }
  });
});

module.exports = router;
