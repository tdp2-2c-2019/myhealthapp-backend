import HealthService from '../services/health_services';
import calculateDistance from '../utils/geodistance';
import { ValidationError } from '../errors/errors';

const router = require('express').Router();

const maxDistance = 0.5;

const getDistanceFilters = (query) => {
  const { distance } = query;
  const origin = {
    lat: Number(query.originLat),
    lon: Number(query.originLon)
  };
  if (origin.lat && origin.lon) return { distance, origin };
  return undefined;
};

const getFilters = (query) => {
  const filters = { ...query };
  Object.keys(filters).forEach(key => (filters[key] === undefined || filters[key].localeCompare('') === 0 || key.localeCompare('originLat') === 0 || key.localeCompare('originLon') === 0 || key.localeCompare('distance') === 0) && delete filters[key]);
  return filters;
};

const filterByDistance = (element, filters) => {
  const { distance } = filters;
  return (!distance && element.distance < maxDistance)
    || (distance && element.distance < distance);
};

router.get('/hospitals', (req, res, next) => {
  const filters = getFilters(req.query);
  HealthService.getHospitals(filters).then((hospitals) => {
    const distanceFilters = getDistanceFilters(req.query);
    if (distanceFilters) {
      const filteredHospitals = hospitals
        .map(h => ({ ...h, distance: calculateDistance(distanceFilters.origin, { lon: h.lon, lat: h.lat }) }))
        .filter(hospital => filterByDistance(hospital, distanceFilters));
      res.status(200).send(filteredHospitals);
    } else {
      res.status(200).send(hospitals);
    }
  }).catch(err => next(err));
});

router.get('/hospitals/:id', (req, res, next) => {
  HealthService.getHospitalByID(req.params.id)
    .then(hospital => res.status(200).send(hospital)).catch(err => next(err));
});

router.post('/hospitals', (req, res, next) => {
  if (!req.body.minimum_plan || !req.body.name || !req.body.telephone || !req.body.mail || !req.body.address) {
    throw new ValidationError('Plan minimo, nombre, telefono, direccion o mail no encontrados');
  }
  HealthService.createHospital(req.body.name, req.body.telephone, req.body.minimum_plan, req.body.mail, req.body.lat, req.body.lon, req.body.address, req.body.zone)
    .then((hospital) => { res.status(201).json(hospital); })
    .catch((err) => {
      res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message });
    });
});

router.get('/doctors/:id', (req, res, next) => {
  HealthService.getDoctorByID(req.params.id)
    .then(doctor => res.status(200).send(doctor)).catch(err => next(err));
});

router.get('/doctors', (req, res, next) => {
  const filters = getFilters(req.query);
  HealthService.getDoctors(filters)
    .then((doctors) => {
      const distanceFilters = getDistanceFilters(req.query);
      if (distanceFilters) {
        const filteredDoctors = doctors
          .map(d => ({ ...d, distance: calculateDistance(distanceFilters.origin, { lon: d.lon, lat: d.lat }) }))
          .filter(doctor => filterByDistance(doctor, distanceFilters));
        res.status(200).send(filteredDoctors);
      } else {
        res.status(200).send(doctors);
      }
    }).catch(err => next(err));
});

router.post('/doctors', (req, res, next) => {
  if (!req.body.minimum_plan || !req.body.name || !req.body.telephone || !req.body.mail || !req.body.address) {
    throw new ValidationError('Plan minimo, nombre, telefono, dirección o mail no encontrados');
  }
  HealthService.createDoctor(req.body.name, req.body.telephone, req.body.minimum_plan, req.body.mail, req.body.lat, req.body.lon, req.body.address, req.body.address_notes, req.body.zone)
    .then((doctor) => { res.status(201).json(doctor); })
    .catch((err) => {
      res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message });
    });
});

router.get('/', (req, res, next) => {
  const filters = getFilters(req.query);
  HealthService.getHealthServices(filters)
    .then(services => res.status(200).send(services)).catch(err => next(err));
});

export default router;
