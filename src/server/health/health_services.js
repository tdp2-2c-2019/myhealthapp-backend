import HealthService from '../services/health_services';
import calculateDistance from '../utils/geodistance';

const router = require('express').Router();

const maxDistance = 0.5;

const getDistanceFilters = (query) => {
  const { distance } = query;
  const origin = {
    lat: Number(query.originLat),
    lon: Number(query.originLon)
  };
  return { distance, origin };
};

const getFilters = (query) => {
  const filters = { ...query };
  Object.keys(filters).forEach(key => (filters[key] === undefined || key.localeCompare('originLat') === 0 || key.localeCompare('originLon') === 0) && delete filters[key]);
  return filters;
};

const filterByDistance = (element, filters) => {
  const {
    distance, origin
  } = filters;
  const destination = {
    lat: Number(element.lat),
    lon: Number(element.lon)
  };
  // Disable distance filter temporarily
  return true;
  // return (!distance && calculateDistance(origin, destination) < maxDistance)
  //   || (distance && calculateDistance(origin, destination) < distance);
};

router.get('/hospitals', (req, res, next) => {
  const filters = getFilters(req.query);
  HealthService.getHospitals(filters).then((hospitals) => {
    const filteredHospitals = hospitals
      .filter(hospital => filterByDistance(hospital, getDistanceFilters(req.query)));
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
  HealthService.getDoctors(filters)
    .then((doctors) => {
      const filteredDoctors = doctors.filter(doctor => filterByDistance(doctor, getDistanceFilters(req.query)));
      res.status(200).send(filteredDoctors);
    }).catch(err => next(err));
});

router.get('/', (req, res, next) => {
  HealthService.getHealthServices()
    .then(services => res.status(200).send(services)).catch(err => next(err));
});

export default router;
