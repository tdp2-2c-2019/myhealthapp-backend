const { Pool } = require('pg');

// Heroku sets postgresql's connection info under DATABASE_URL env var
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL : `postgres://${process.env.USER}:@localhost:5432/postgres`,
  ssl: !!process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      if (err) {
        return console.error('Error executing query', err.stack);
      }
      const duration = `${Date.now() - start}ms`;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      callback(err, res);
    });
  },
};
