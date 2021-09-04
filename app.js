require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(require('./routes'));

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    chalk.magenta(
      `Server running in`,
      chalk.red(`${process.env.NODE_ENV}`),
      `mode on port ${PORT} \n http://localhost:${PORT}`
    )
  )
);
