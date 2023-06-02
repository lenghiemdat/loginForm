const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost', //'localhost',
    user: 'root',
    password: '',
    port: 3306, //port mysql
    database: 'tdf'
})

module.exports = db;