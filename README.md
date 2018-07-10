# node-hackernews-api

## Using the App
1. `Clone the Repository`.
2. Run `npm install`
3. `Add .env file to add all the environment variables. Sample shown below for local use`
 ```
 # APP CONFIG
 APP_PORT=4000
 APP_ENV=DEV

 # DEV Mongo DB CREDENTIALS
 MONGO_USER_NAME=admin
 MONGO_USER_PASSWD=
 MONGO_DB_NAME='hacker-news'
 MONGO_DB_URL=127.0.0.1
 MONGO_DB_PORT=27017

```

4. `This app uses Mongo DB for search and store the top stories Mongo DB running locally or remotely. Add all the necessary configs in env for the mongodb`

5. Run `npm start`
6. `You can access http://HOST:PORT/api/searchnews?query=Autonomy`
