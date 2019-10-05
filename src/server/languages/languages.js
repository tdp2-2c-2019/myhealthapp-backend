import LanguagesService from '../services/languages';

const router = require('express').Router();

router.get('/', (req, res, next) => {
  LanguagesService.getLanguages()
    .then(langs => res.send(langs))
    .catch(err => res.status(err.statusCode ? err.statusCode : 500).json({ error: err.message }));
});

export default router;
