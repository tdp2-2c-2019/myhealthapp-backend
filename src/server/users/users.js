import randomBytes from 'crypto';
import UserService from '../services/users';
import { ValidationError } from '../errors/errors';
import sendAccountRecoveryEmail from '../utils/mailer';

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

router.post('/account/recover', (req, res, next) => {
  if (!req.query.mail) {
    throw new ValidationError('Ingrese un mail');
  }
  UserService.getUserByMail(req.query.mail).then((user) => {
    const token = randomBytes(5, (err, buffer) => buffer.toString());
    const userWithToken = { ...user, token };
    UserService.updateUser(userWithToken).then(() => {
      const err = sendAccountRecoveryEmail(userWithToken);
      if (err != null) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });
});

export default router;
