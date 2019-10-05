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

app.post('/api/login', HandlerGenerator.login);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).send({ error: err.message || 'Error interno' });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
