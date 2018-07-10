const _ = require('lodash');
const request = require('request');

const hackerNewsDao = require('../../dao/hackerNewsDao');
const utils = require('../../common/utils');

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
    });
  },

  searchText: (req, res) => {
    let params = _.get(req, 'query', '');
    hackerNewsDao.textSearch({
        $text: { $search: params.query }
    }).then(response => {
        return utils.responseSuccess(res, {}, response);
      })
      .catch(err => {
        return utils.responseError(res, err);
      })
  }

};
