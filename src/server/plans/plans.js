import PlanService from '../services/plans';

const router = require('express').Router();

router.get('/', (req, res, next) => {
  PlanService.getPlans()
    .then(plans => res.send(plans))
    .catch(err => res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message }));
});

export default router;
