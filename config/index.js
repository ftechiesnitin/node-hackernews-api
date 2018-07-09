const dotenv = require('dotenv');
const _ = require('lodash');

// Load environment variables from .env file
dotenv.load();

let config = module.exports = {};

// App configuration
config.APP_ENV = _.get(process, 'env.APP_ENV', 'DEV');
config.PORT = _.get(process, 'env.APP_PORT', 4000);
