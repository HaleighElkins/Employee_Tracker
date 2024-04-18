// const mysql = require('mysql2');

// require('dotenv').config();

// const connection = mysql.createConnection({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: process.env.MYSQL_PASSWORD,
//   database: 'employees'
// });

// module.exports = connection;

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  password: process.env.PG_PASSWORD,
  host: 'localhost',
  database: 'employee_db' 
});

module.exports = pool;
