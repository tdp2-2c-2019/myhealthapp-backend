import { UserService } from '../services/users';

const router = require('express').Router();

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// User registers with dni, mail and password and we verify against db
router.post('/', (req, res, next) => {
  if (!req.body.dni || !req.body.mail || !req.body.password) {
    throw new ValidationError('Missing DNI, mail or password');
  }
  UserService.createUser(req.body.dni, req.body.password, req.body.mail)
    .then(res.sendStatus(201)).catch(err => res.status(err.statusCode).send(err.message));
});

export default router;
