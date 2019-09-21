import HealthService from '../services/health_services';
import calculateDistance from '../utils/geodistance';

const router = require('express').Router();

const maxDistance = 0.5;

router.get('/hospitals', (req, res, next) => {
  const {
    name, telephone, distance
  } = req.query;
  const origin = {
    lat: Number(req.query.originLat),
    lon: Number(req.query.originLon)
  };
  HealthService.getHospitals().filter((hospital) => {
    const destination = {
      lat: Number(hospital.lat),
      lon: Number(hospital.lon)
    };
    const nameFilter = !name || (name && hospital.name.localeCompare(name) === 0);
    const telephoneFilter = !telephone || (telephone
      && hospital.telephone.localeCompare(telephone) === 0);
    const distanceFilter = (!distance && calculateDistance(origin, destination) < maxDistance)
      || (distance && calculateDistance(origin, destination) < distance);
    return nameFilter && telephoneFilter && distanceFilter;
  })
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
  const {
    name, telephone, distance
  } = req.query;
  const origin = {
    lat: Number(req.query.originLat),
    lon: Number(req.query.originLon)
  };
  HealthService.getDoctors().filter((doctor) => {
    const destination = {
      lat: Number(doctor.lat),
      lon: Number(doctor.lon)
    };
    const nameFilter = !name || (name && doctor.name.localeCompare(name) === 0);
    const telephoneFilter = !telephone || (telephone
      && doctor.telephone.localeCompare(telephone) === 0);
    const distanceFilter = (!distance && calculateDistance(origin, destination) < maxDistance)
      || (distance && calculateDistance(origin, destination) < distance);
    return nameFilter && telephoneFilter && distanceFilter;
  }).then(doctors => res.status(200).send(doctors)).catch(err => next(err));
});

router.get('/', (req, res, next) => {
  HealthService.getHealthServices()
    .then(services => res.status(200).send(services)).catch(err => next(err));
});

export default router;
