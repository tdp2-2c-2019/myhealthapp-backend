import { randomBytes } from 'crypto';
import UserService from '../services/users';
import { ValidationError } from '../errors/errors';
import sendAccountRecoveryEmail from '../utils/mailer';
import CryptoService from '../utils/crypto';

const router = require('express').Router();

// User registers with dni, mail and password and we verify against db
router.post('/', (req, res, next) => {
  if (!req.body.dni || !req.body.mail || !req.body.password || !req.body.plan) {
    throw new ValidationError('DNI, mail, plan o passwords no encontrados');
  }
  UserService.createUser(req.body.dni,
    req.body.password,
    req.body.mail,
    req.body.firstName,
    req.body.lastName,
    req.body.plan).then(() => {
    res.sendStatus(201);
  }).catch((err) => {
    res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message });
  });
});

router.post('/account/recover', (req, res, next) => {
  const { mail } = req.body;
  if (!mail) {
    throw new ValidationError('Ingrese un mail');
  }
  UserService.getUserByMail(mail).then((user) => {
    const token = randomBytes(3).toString('hex');
    const userWithToken = { ...user, token };
    UserService.updateUser(userWithToken).then(() => {
      const err = sendAccountRecoveryEmail(userWithToken);
      if (err != null) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    }).catch((err) => {
      res.status(500).json({ message: err.message });
    });
  }).catch(err => next(err));
});

router.put('/password', (req, res, next) => {
  const { password, token } = req.body;
  if (!password || !token) {
    throw new ValidationError('Password o token faltantes');
  }
  UserService.getUserByToken(token).then((user) => {
    CryptoService.encrypt(password).then((hashedPassword) => {
      UserService.updateUser({ ...user, token: null, password: hashedPassword })
        .then(res.sendStatus(200))
        .catch((err) => { res.status(err.statusCode).json(err.message); });
    });
  }).catch(err => res.status(err.statusCode).json({ message: err.message }));
});

router.get('/:dni/family-group', (req, res, next) => {
  UserService.getUserFamilyGroup(req.params.dni)
    .then(users => res.status(200).json(users))
    .catch(err => next(err));
});

export default router;
