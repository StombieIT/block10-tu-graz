require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { commentsRouter, quotesRouter, reactionsRouter } = require('./routers');

const {
    SERVER_PORT = 3000,
    MONGO_DB_USERNAME = 'admin',
    MONGO_DB_PASSWORD = 'admin',
    MONGO_DB_HOST = 'localhost',
    MONGO_DB_PORT = 27017,
    CLIENT_HOST = 'localhost',
    CLIENT_PORT = 4173
} = process.env;

const CLIENT_ORIGIN = `http://${CLIENT_HOST}:${CLIENT_PORT}`;

async function runApp({ port, dbConnectionString }, ...routers) {
    const app = express();

    app.use(cors({
        origin: [CLIENT_ORIGIN]
    }));
    app.use(express.json());

    routers.forEach(router => app.use(router));
    await mongoose.connect(dbConnectionString);

    app.listen(port);
}

const dbConnectionString = `mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}`;

const appOptions = {
    port: SERVER_PORT,
    dbConnectionString
};

runApp(
    appOptions,
    quotesRouter,
    commentsRouter,
    reactionsRouter
);
