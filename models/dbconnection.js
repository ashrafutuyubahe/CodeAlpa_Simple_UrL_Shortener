require('dotenv').config();
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USERNAME,
  password : process.env.password,
  database : process.env.dbname,
});
 
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });
  
 
  module.exports = connection;

