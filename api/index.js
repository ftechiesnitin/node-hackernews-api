const express = require("express");
const compression = require('compression');

const api = express();

// api controllers
const hk = require('./controller/hackerNews');

// middlewares
api.use(express.json());
api.use(compression());
// handle cors
api.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

api.get('/hackerNews/topstories', hk.topStories);

module.exports = api;
