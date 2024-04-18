const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  password: process.env.PG_PASSWORD,
  host: 'localhost',
  database: 'employee_db' 
});

module.exports = pool;
