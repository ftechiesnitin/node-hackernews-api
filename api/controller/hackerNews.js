const _ = require('lodash');
const utils = require('../../common/utils');
const request = require('request');

module.exports = {

  topStories: (req, res) => {
    let options = {
      url: 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
        json: true
    };

    request(options, (err, response, body) => {
      if(err || response.statusCode !== 200) return utils.responseError(res, err);

      return utils.responseSuccess(res, {}, body);
    })
  }

};
