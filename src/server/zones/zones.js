import ZoneService from '../services/zones';

const router = require('express').Router();

router.get('/', (req, res, next) => {
  ZoneService.getZones()
    .then(zones => res.send(zones))
    .catch(err => res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message }));
});

export default router;
