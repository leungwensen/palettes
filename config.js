const _ = require('lodash');
const path = require('path');

const DEFAULT_CONFIG = {
    path: {
        static: path.resolve(__dirname, './static'),
        upload: path.resolve(__dirname, './static/upload'),
    },
    server: {
        port: 9090,
    },
    db: {
        name: 'palette_forms',
        connection: {
            insecureAuth: true,
            multipleStatements: true,
            password: '123456',
            user: 'root',
        }
    }
};

let config = _.cloneDeep(DEFAULT_CONFIG);

try {
    config = _.merge(config, DEFAULT_CONFIG,  require('./config.local'));
} catch(e) {
    console.info('config.local.js not found');
}

module.exports = config;
