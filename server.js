const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const moment = require('moment');
const timeout = require('connect-timeout');
const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes');
// Load the application configurations from the config object.
const config = require('config');
const port = process.env.PORT || 8080;
// Tasks API route
const tasksRoutes = require('./routes/tasksRoute');
// Connect to MongoDB via Mongoose ORM
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const options = {
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: config.database.timeout
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS : config.database.timeout
    }
  }
};

mongoose.connect(config.database.host, options)
  .then(() =>  console.log('Database connection succesful'))
  .catch((err) => console.error.bind(console, 'Database connection error: '));

// Don't show the log when the env is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    // morgan to log the requests on command line using 'tiny' style logs
    app.use(morgan('tiny'));
}

app.use(timeout(config.http.timeout));
// Parse the JSON request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/json'}));
app.use(expressValidator({
  customValidators: {
    isDateFormat: function(value) {
      return moment(value, "YYYY-MM-DD", true).isValid();
    }
  }
}));

// Middleware to handle response timeout
app.use((req, res, next) => {
  if (!req.timedout) next();
});
app.use('/tasks', tasksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error details:\n ${err.details}`);
  if(err.name === 'ResourceNotFoundError') {
    res.status(NOT_FOUND).json({ message: err.message});
  } else {
    res.status(INTERNAL_SERVER_ERROR).json({ message: err.message});
  }
});

app.listen(port);
console.log(`Listening on port: ${port}`);

module.exports = app;
