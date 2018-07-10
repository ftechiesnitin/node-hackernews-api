const mongoDb = require('../db/mongodbDao');
// utils
const utils = require('../common/utils');

class HackerNewsDao {

  /**
   * Update / insert top news location
   * @param {Object} data - hacker news top story data
   */
  addTopStory(data) {
    return new Promise((resolve, reject) => {
      mongoDb.updateOne('top_stories', {
        _id: data.id
      }, {
        $set: data,
      }, (error, document) => {
        if (error) {
          reject(error)
        } else {
          resolve(document);
        }
      }, {
        upsert: true
      })
    })
  }

  /**
   * Add Index to Collection
   * @param {Object} data - hacker news top story data
   */
  createTitleTextIndex(data) {
    return new Promise((resolve, reject) => {
      mongoDb.createIndex('top_stories', { title: "text" }, (error, document) => {
        if (error) {
          reject(error)
        } else {
          resolve(document);
        }
      });
    })
  }

  /**
   * Add Index to Collection
   * @param {Object} data - hacker news top story data
   */
  textSearch(query) {
    return new Promise((resolve, reject) => {
      mongoDb.searchText('top_stories', query, (error, document) => {
        if (error) {
          reject(error)
        } else {
          resolve(document);
        }
      });
    })
  }

}

const hackerNewsDao = new HackerNewsDao();

module.exports = hackerNewsDao;
