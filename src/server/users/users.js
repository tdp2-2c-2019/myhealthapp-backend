import UserService from '../services/users';

const router = require('express').Router();

// Users register with dni, mail and password and we verify against db
router.post('/', (req, res, next) => {
  try {
    UserService.createUser(req.body.dni, req.body.password, req.body.mail);
    res.sendStatus(201);
  } catch (error) {
    return next(error);
  }
});

export default router;
