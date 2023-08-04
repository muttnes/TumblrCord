const pgPromise = require('pg-promise')();
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: '5432',
    database: 'TumblrCord'
};

const db = pgPromise(dbConfig);

module.exports = db;