const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(require('./routes'));

app.listen(port, console.log(`Server running on port ${port}`));
