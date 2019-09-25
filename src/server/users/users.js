import UserService from '../services/users';
import { ValidationError } from '../errors/errors';

const router = require('express').Router();

// User registers with dni, mail and password and we verify against db
router.post('/', (req, res, next) => {
  if (!req.body.dni || !req.body.mail || !req.body.password) {
    throw new ValidationError('DNI, mail o passwords no encontrados');
  }
  UserService.createUser(req.body.dni,
    req.body.password,
    req.body.mail,
    req.body.firstName,
    req.body.lastName,
    req.body.plan).then(() => {
    res.sendStatus(201);
  }).catch((err) => {
    res.status(err.statusCode).json({ error: err.message });
  });
});

export default router;
