const Mongo = require('mongodb');
const pino = require('pino')();

const cfg = require('../config');

const DBName = cfg.MONGO_DB_NAME
const dbUrl = cfg.MASTER_MONGO_CONNECTION;

class MongodbDao {

    constructor() {
        this.conn = null;
    }

    logError(err, msg, query, options) {
      pino.error(msg, query, options);
      return pino.error(err);
    }

    getDBConnection(callback) {
        Mongo.MongoClient.connect(dbUrl, (err, conn) => {
            if (err) {
                pino.error('Mongo Connection Error');
                pino.error(err);
                return;
            }
            this.conn = conn;
            return callback(err, conn);
        });
    }

    release(conn) {
        return conn.close();
    }

    createIndex(collection, query, callback, options) {
        if (!options) options = {};
        let db = this.conn.db('' + DBName + '');
        db.collection(collection).createIndex(query, options, (error, document) => {
            if(error) this.logError(error, 'Mongo Index query Error: ', query, options);
            if(callback) {
                callback(error, document)
            }
        });
    }

    findOne(collection, query, callback, options) {
        if (!options) options = {};
        let db = this.conn.db('' + DBName + '');
        db.collection(collection).findOne(query, options, (error, document) => {
            if(error) this.logError(error, 'Mongo FindOne query Error: ', query, options);
            if(callback) {
                callback(error, document)
            }
        });
    }

    updateOne(collection, query, data, callback, options) {
        if (!options) options = {};
        let db = this.conn.db('' + DBName + '');

        db.collection(collection).updateOne(query, data, options, (error, document) => {
            if(error) this.logError(error, 'Mongo UpdateOne query Error: ', query, options);
            if (callback) {
                callback(error, document)
            } else {
                return;
            }
        });
    }

    searchText(collection, query, callback, options = {}) {
      if (!query) return callback('query-required');

      let db = this.conn.db('' + DBName + '');
console.log('collection', collection, query);
      db.collection(collection).find(query, options)
        // .project({ score: { $meta: "textScore" } })
        // .sort({score: {$meta: "textScore"}})
        .toArray((error, documents) => {
          if(error) this.logError(error, 'Mongo TextSearch query Error: ', query, options);
          if(callback) {
            return callback(error, documents);
          }
        })
    }

}

const db = new MongodbDao();

module.exports = db;
