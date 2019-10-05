import SpecializationService from '../services/specializations';

const router = require('express').Router();

router.get('/', (req, res, next) => {
  SpecializationService.getSpecializations()
    .then(specializations => res.send(specializations))
    .catch(err => res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message }));
});

export default router;
