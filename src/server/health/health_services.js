import HealthService from '../services/health_services';
import calculateDistance from '../utils/geodistance';

const router = require('express').Router();

const maxDistance = 0.5;

const getFilters = (query) => {
  const {
    name, telephone, distance
  } = query;
  const origin = {
    lat: Number(query.originLat),
    lon: Number(query.originLon)
  };
  return {
    name, telephone, distance, origin
  };
};

const filterResults = (element, filters) => {
  const {
    name, telephone, distance, origin
  } = filters;
  const destination = {
    lat: Number(element.lat),
    lon: Number(element.lon)
  };
  const nameFilter = !name || (name && element.name.localeCompare(name) === 0);
  const telephoneFilter = !telephone || (telephone
    && element.telephone.localeCompare(telephone) === 0);
  const distanceFilter = (!distance && calculateDistance(origin, destination) < maxDistance)
    || (distance && calculateDistance(origin, destination) < distance);
  return nameFilter && telephoneFilter && distanceFilter;
};

router.get('/hospitals', (req, res, next) => {
  const filters = getFilters(req.query);
  HealthService.getHospitals().then((hospitals) => {
    const filteredHospitals = hospitals.filter(hospital => filterResults(hospital, filters));
    res.status(200).send(filteredHospitals);
  }).catch(err => next(err));
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
  const filters = getFilters(req.query);
  HealthService.getDoctors().then((doctors) => {
    const filteredDoctors = doctors.filter(doctor => filterResults(doctor, filters));
    res.status(200).send(filteredDoctors);
  }).catch(err => next(err));
});

router.get('/', (req, res, next) => {
  HealthService.getHealthServices()
    .then(services => res.status(200).send(services)).catch(err => next(err));
});

export default router;
