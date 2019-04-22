
// const debug = require('debug')('lib:pool-connection');
const _ = require('lodash');
const mysql = require('mysql');
const DBConfig = require('../config').db;

const pool = mysql.createPool(_.assign({
    database: DBConfig.name,
}, DBConfig.connection));

module.exports = callback => {
    pool.getConnection((err, connection) => {
        callback(err, connection);
    });
};
