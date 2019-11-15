import UserService from '../services/users';
import AuthorizationService from '../services/authorizations';

const router = require('express').Router();

router.get('/affiliates', (req, res, next) => {
  UserService.getSummarizedInfo()
    .then(info => res.send(info))
    .catch(err => next(err));
});

router.get('/authorizations', (req, res, next) => {
  AuthorizationService.getSummarizedInfo()
    .then(info => res.send(info))
    .catch(err => next(err));
});

export default router;
