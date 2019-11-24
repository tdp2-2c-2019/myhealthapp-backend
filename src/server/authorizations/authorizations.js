import AuthorizationService from '../services/authorizations';
import PushNotificationService from '../services/push_notifications';
import UserService from '../services/users';
import { ValidationError } from '../errors/errors';

const router = require('express').Router();

const pushNotificationService = new PushNotificationService();

router.get('/', (req, res, next) => {
  AuthorizationService.getAuthorizations()
    .then(auths => res.send(auths))
    .catch(err => res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message }));
});

router.get('/types', (req, res, next) => {
  AuthorizationService.getTypes()
    .then(types => res.status(200).send(types))
    .catch(err => next(err));
});

router.post('/types', (req, res, next) => {
  if (!req.body.title || !req.body.minimum_plan) {
    next(new ValidationError('Datos insuficientes para crear el tipo de autorización'));
  } else {
    AuthorizationService.createType(req.body.title, req.body.minimum_plan)
      .then(type => res.status(200).send(type))
      .catch(err => next(err));
  }
});

router.get('/:id', async (req, res, next) => {
  AuthorizationService.getAuthorizationByID(req.params.id)
    .then(authorization => res.status(200).send(authorization)).catch(err => next(err));
});

router.get('/:id/history', async (req, res, next) => {
  AuthorizationService.getAuthorizationHistoryByID(req.params.id)
    .then(history => res.status(200).send(history))
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  if (!req.body.status) {
    next(new ValidationError('Datos insuficientes para actualizar la autorización, se necesita el estado'));
  } else {
    AuthorizationService.putAuthorizationByID(req.params.id, req.body)
      .then((authorization) => {
        res.status(200).send(authorization);
        UserService.getUserByDNI(authorization.created_for.dni)
          .then((user) => {
            pushNotificationService
              .sendPushNotification(
                user.firebase_token,
                { data: { MyHealthApp: `Su solicitud ${authorization.id} ha sido ${authorization.status}` } }
              );
          })
          .catch(err => next(err));
      }).catch(err => next(err));
  }
});

router.post('/', (req, res, next) => {
  if (!req.body.created_by || !req.body.created_for || !req.body.title || !req.body.type) {
    next(new ValidationError('Datos insuficientes para crear la autorización'));
  } else {
    AuthorizationService
      .createAuthorization(req.body.created_by, req.body.created_for, req.body.title, req.body.type)
      .then(auth => res.status(201).send(auth))
      .catch(err => next(err));
  }
});

export default router;
