require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { commentsRouter, quotesRouter, reactionsRouter } = require('./routers');

const {
    PORT = 3000,
    MONGO_DB_USERNAME = 'admin',
    MONGO_DB_PASSWORD = 'admin',
    MONGO_DB_HOST = 'localhost',
    MONGO_DB_PORT = 27017
} = process.env;

async function runApp({ port, dbConnectionString }, ...routers) {
    const app = express();

    app.use(express.json());

    routers.forEach(router => app.use(router));
    await mongoose.connect(dbConnectionString);

    app.listen(port);
}

const dbConnectionString = `mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}`;

const appOptions = {
    port: PORT,
    dbConnectionString
};

runApp(
    appOptions,
    quotesRouter,
    commentsRouter,
    reactionsRouter
);
