const dotenv = require('dotenv');
const _ = require('lodash');

// Load environment variables from .env file
dotenv.load();

let config = module.exports = {};

// App configuration
config.APP_ENV = _.get(process, 'env.APP_ENV', 'DEV');
config.PORT = _.get(process, 'env.APP_PORT', 4000);

// Mongo Connection String
config.MONGO_USER_NAME = _.get(process, 'env.MONGO_USER_NAME', '');
config.MONGO_USER_PASSWORD = _.get(process, 'env.MONGO_USER_PASSWD', '');
config.MONGO_DB_URL = _.get(process, 'env.MONGO_DB_URL', '');
config.MONGO_DB_NAME = _.get(process, 'env.MONGO_DB_NAME', '');
config.MASTER_MONGO_CONNECTION = 'mongodb://' + config.MONGO_USER_NAME  + ':' + config.MONGO_USER_PASSWORD + '@' + config.MONGO_DB_URL + '/' + config.MONGO_USER_NAME + '?retryWrites=true';
