require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');  
 
const app = express();
const port = process.env.PORT || 3000;
 
app.use(bodyParser.json());
app.use(routes);  // This uses the router exported from routes.js
 
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
 
module.exports = app;