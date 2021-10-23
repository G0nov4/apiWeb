const mysql = require('mysql');
const { promisify } = require('util');


const config = {
    host: process.env.CLEVER_CLOUD_HOST,
    user: process.env.CLEVER_CLOUD_USER,
    password: process.env.CLEVER_CLOUD_PWD,
    database: process.env.CLEVER_CLOUD_DB
}

// Create a mysql pool
const pool = mysql.createPool(config);
pool.getConnection(function (err, connection) {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Se cerró la conexión a la base de datos.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('La Base de datos tiene muchas conexiones');
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Se rechazó la conexión a la base de datos');
      }
    }
  
    if (connection)
      connection.release();
    console.log('La BD está conectado');
  
    return;
  });

pool.query = promisify(pool.query);
module.exports = pool;