require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(require('./routes'));

// catch 404
app.use(notFound);
// error handler
app.use(errorHandler);

module.exports = app;
