import HealthService from '../services/health_services';

const router = require('express').Router();

router.get('/', (req, res, next) => {
  HealthService.getHealthServices().then((services) => {
    res.status(200).send(services);
  }).catch(err => next(err));
});

export default router;