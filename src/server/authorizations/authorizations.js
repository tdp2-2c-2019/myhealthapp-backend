import AuthorizationService from '../services/authorizations';
import { ValidationError } from '../errors/errors';

const router = require('express').Router();

router.get('/', (req, res, next) => {
  AuthorizationService.getAuthorizations()
    .then(auths => res.send(auths))
    .catch(err => res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message }));
});

router.get('/:id', async (req, res, next) => {
  AuthorizationService.getAuthorizationByID(req.params.id)
    .then(authorization => res.status(200).send(authorization)).catch(err => next(err));
});

router.put('/:id', async (req, res, next) => {
  if (!req.body.status) {
    next(new ValidationError('Datos insuficientes para actualizar la autorización, se necesita el estado'))
  } else {
    AuthorizationService.putAuthorizationByID(req.params.id, req.body)
      .then(authorization => res.status(200).send(authorization)).catch(err => next(err)); 
  }
});

router.post('/', (req, res, next) => {
  if (!req.body.created_by || !req.body.created_for || !req.body.title) {
    next(new ValidationError('Datos insuficientes para crear la autorización'));
  } else {
    AuthorizationService.createAuthorization(req.body.created_by, req.body.created_for, req.body.title)
      .then(a => res.status(201).send(a))
      .catch(err => next(err));
  }
});

export default router;
