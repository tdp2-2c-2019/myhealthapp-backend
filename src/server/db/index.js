const { Pool } = require('pg');
// Heroku sets postgresql's connection info under DATABASE_URL env var
const db = require('knex')(
  {
    client: 'pg',
    connection: process.env.DATABASE_URL ? process.env.DATABASE_URL : `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/${process.env.PGDATABASE}`
  }
);

module.exports = {
  db,
};
