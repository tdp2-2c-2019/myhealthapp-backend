require('dotenv').config();
const express = require('express');
const { checkToken, HandlerGenerator } = require('./middleware/jwt');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/api/health-services', checkToken, require('./health/health_services').default);

app.use('/api/users', require('./users/users').default);

app.post('/api/login', HandlerGenerator.login);

app.get('/api/mail', require('./utils/mailer').default);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).send({ error: err.message || 'Error interno' });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
