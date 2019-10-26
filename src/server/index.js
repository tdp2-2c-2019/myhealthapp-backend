require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { HandlerGenerator } = require('./middleware/jwt');

const app = express();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/api/health-services', require('./health/health_services').default);

app.use('/api/users', require('./users/users').default);
app.use('/api/plans', require('./plans/plans').default);
app.use('/api/specializations', require('./specializations/specializations').default);
app.use('/api/languages', require('./languages/languages').default);
app.use('/api/zones', require('./zones/zones').default);
app.use('/api/authorizations', require('./authorizations/authorizations').default);

app.post('/api/login', HandlerGenerator.login);

app.get('/api/search-key', (req, res) => {
  res.status(200).json({ key: process.env.GCP_API_KEY });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).send({ error: err.message || 'Error interno' });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
