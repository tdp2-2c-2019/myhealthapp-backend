import AuthorizationService from '../services/authorizations';

const router = require('express').Router();

router.get('/', (req, res, next) => {
// TODO: If auth is used return only my authorizations, else return all for admin
  const dni = req.decoded ? req.decoded : null;
  AuthorizationService.getAuthorizations(dni)
    .then(auths => res.send(auths))
    .catch(err => res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message }));
});

router.get('/:id', (req, res, next) => {
  AuthorizationService.getAuthorizationByID(req.params.id)
    .then(authorization => res.status(200).send(authorization)).catch(err => next(err));
});

export default router;
