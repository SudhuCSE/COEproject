require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');  

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', routes);  // Use `/api` as the base path for your routes

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
