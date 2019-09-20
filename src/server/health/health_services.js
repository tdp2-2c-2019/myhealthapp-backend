import HealthService from '../services/health_services';

const router = require('express').Router();

router.get('/hospitals', (req, res, next) => {
  HealthService.getHospitals()
    .then(hospitals => res.status(200).send(hospitals)).catch(err => next(err));
});

router.get('/hospitals/:id', (req, res, next) => {
  HealthService.getHospitalByID(req.params.id)
    .then(hospital => res.status(200).send(hospital)).catch(err => next(err));
});

router.get('/doctors/:id', (req, res, next) => {
  HealthService.getDoctorByID(req.params.id)
    .then(doctor => res.status(200).send(doctor)).catch(err => next(err));
});

router.get('/doctors', (req, res, next) => {
  HealthService.getDoctors().then(doctors => res.status(200).send(doctors)).catch(err => next(err));
});

router.get('/', (req, res, next) => {
  HealthService.getHealthServices()
    .then(services => res.status(200).send(services)).catch(err => next(err));
});

export default router;