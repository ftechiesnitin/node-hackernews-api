const request = require('request');
const pino = require('pino')();
const async = require('async');

const hackerNewsDao = require('../dao/hackerNewsDao');

const job = {

  getStoryInfo: (storyId) => {
    return new Promise((resolve, reject) => {
      let options = {
        url: 'https://hacker-news.firebaseio.com/v0/item/' + storyId + '.json?print=pretty',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        json: true
      };

      request(options, (err, response, body) => {
        if(err || response.statusCode !== 200) return reject(err);
        return resolve(body);
      });
    })
  },

  addStories: () => {
    let options = {
      url: 'http://localhost:4000/api/hackerNews/topstories',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      json: true
    };

    request(options, (err, response, body) => {
      if(err || response.statusCode !== 200) return pino.error(err);

      async.each(body.data, (story, nextStory) => {

        job.getStoryInfo(story)
          .then(storyInfo => hackerNewsDao.addTopStory(storyInfo))
          .then(document => {
            return nextStory();
          })
          .catch(err => nextStory(err));
      }, (error) => {
        if(error) return pino.error(error);

        hackerNewsDao.createTitleTextIndex()
          .then(() => {
            return pino.info('All Top Stories Added');
          })
          .catch((err) => {
            return pino.info(err);
          });
      });
    });
  }
}

module.exports = job;
