const mysql = require('mysql2');

// MySQL connection pool
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'RP738964$',
  database: 'petcare',
  connectionLimit: 10
});

module.exports = connection;
