
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const cors = require('./src/cors'); // Created my own cors middleware


// Database connection setup.
if (process.env.NODE_ENV !== "production") {
    const dotenv = require('dotenv');
    dotenv.config();
}

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(
        () => {console.log("connected successfully")},
        err => {console.log("failed to connect with " + err)}
        );

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors); // uses cors
routes(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});

module.exports = app;