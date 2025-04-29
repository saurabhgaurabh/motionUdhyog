const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_motion_udhyog',
    password: '12345678',
    port: 3306
});

module.exports = connection;