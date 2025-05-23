const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'pssms'
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit();
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
