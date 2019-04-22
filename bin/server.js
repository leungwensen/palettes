const _ = require('lodash');
const bodyParser = require('body-parser');
const app = require('connect')();
const fs = require('fs');
const http = require('http');
const server = http.createServer(app);
const request = require('request');
const io = require('socket.io')(server);
const path = require('path');
const serveStatic = require('serve-static');
const dl = require('delivery');
const url = require('url');
// const urlrouter = require('urlrouter');
// const crypto = require('crypto');
const config = require('../config');
const poolConnection = require('../lib/pool-connection');

app
    .use(bodyParser.json()) // parse json body
    .use(bodyParser.urlencoded({
        extended: true
    })) // parse urlencoded body
    .use(bodyParser.raw()) // parse raw body
    .use(bodyParser.text()) // parse text body
    .use((req, res, next) => { // pre-handlers
        const urlInfo = url.parse(req.url, true);
        const query = urlInfo.query || {};
        const body = req.body || {};

        req._urlInfo = urlInfo;
        req._pathname = urlInfo.pathname;

        // add req._params (combination of query and body)
        const params = _.assign({}, query, body);
        req._params = params;
        req._query = query;
        req._body = body;

        res._sendRes = (str, contentType) => {
            const buf = new Buffer(str);
            contentType = contentType || 'text/html;charset=utf-8';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Length', buf.length);
            res.end(buf);
        };
        // res._JSONRes(data) (generate JSON response)
        res._JSONRes = data => {
            res._sendRes(JSON.stringify(data), 'application/json;charset=utf-8');
        };
        // TODO res._JSONError()
        // res._HTMLRes(data) (generate HTML response)
        res._HTMLRes = res._sendRes;

        return next();
    })
    .use('/', serveStatic(path.resolve(__dirname, '../assets')));

// socket.io request
io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('answer.new', (data) => {
        const { riddle, answer, distance } = data;
        const statement = `
        INSERT INTO distance
            (riddle, answer, distance)
        VALUES
            ('${riddle}', '${answer}', '${distance}');
        `;
        console.log('executing SQL statement');
        console.log(data);
        poolConnection((error, conn) => {
            console.log('got DB poll connection');
            if (error) {
                socket.emit('answer.new.error', {
                    message: 'failed to get DB poll connection',
                    error,
                    statement
                });
                return;
            }
            conn.beginTransaction(error => {
                if (error) {
                    socket.emit('answer.new.error', {
                        message: 'failed to init DB transaction',
                        error,
                        statement
                    });
                    conn.release();
                    return;
                }
                console.log('DB transaction began');
                conn.query(statement, error => {
                    if (error) {
                        console.error(error);
                        socket.emit('answer.new.error', {
                            message: 'failed to execute SQL statement',
                            error,
                            statement
                        });
                        return conn.rollback(() => {
                            conn.release();
                        });
                    }
                    console.log('SQL statement executed');
                    conn.commit(error => {
                        if (error) {
                            socket.emit('answer.new.error', {
                                message: 'failed to commit DB transaction',
                                error,
                                statement,
                            });
                            return conn.rollback(() => {
                                conn.release();
                            });
                        }
                        console.log('DB transaction `done');
                        console.log('answer logged!');
                        io.emit('answer.new.success', data);
                        conn.release();
                    });
                });
            });
        });
    });

    socket.on('query.answers', () => {
        const statement = `SELECT * FROM distance ORDER BY id DESC;`;
        console.log('executing SQL statement');
        poolConnection((error, conn) => {
            if (error) {
                socket.emit('query.answers.error', {
                    message: 'failed to get DB poll connection',
                    error,
                    statement
                });
                return;
            }
            console.log('got DB poll connection');
            conn.query(statement, (error, results) => {
                conn.release();
                if (error) {
                    console.log('got DB poll connection');
                    socket.emit('query.answers.error', {
                        message: 'failed to query statement',
                        error,
                        statement
                    });
                    return;
                }
                console.log('got query data, length:' + results.length);
                socket.emit('query.answers.success', results)
            });
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// NOTE: should use server.listen instead of app.listen here
server.listen(config.server.port);
