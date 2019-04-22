#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const pkg = require('../package.json');
const poolConnection = require('../lib/pool-connection');

program
    .version(pkg.version)
    .usage('[options] <file>')
    .parse(process.argv);

let sqlFile = program.args[0];

if (sqlFile) {
    sqlFile = path.resolve(process.cwd(), sqlFile);
    let statements = '';
    const ext = path.extname(sqlFile);
    if (ext === '.js') {
        statements = require(sqlFile);
    } else if (ext === '.sql') {
        statements = fs.readFileSync(sqlFile, 'utf8');
    }
    console.info(`executeing SQL statements: \n${statements}`);
    poolConnection((err, conn) => {
        if (err) throw err;
        conn.query(statements, (err, results, fields) => {
            conn.release();
            if (err) throw err;
            console.info('changed rows: ' + results.changedRows + ' rows');
            console.info('fields: ', fields);
            process.exit();
        });
    });
} else {
    console.error('sql file path is not specified!');
}
