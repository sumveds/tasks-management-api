const schemas = require('./schemas');
const { BAD_REQUEST } = require('http-status-codes');

function sendValidationError(req, res, next) {
  const errors = req.validationErrors();
  if (errors && errors.length > 0) {
    const response = { errors: [] };
    errors.forEach(function(err) {
      response.errors.push({
        field: err.param,
        message: err.msg
      });
    });
    response.message = 'Bad Request';
    return res.status(BAD_REQUEST).json(response);
  }
  return next();
}

function validateGetTasksEndPoint(req, res, next) {
  req.checkQuery(schemas.getTasksEndpointSchema);
  return sendValidationError(req, res, next);
}

function validateSearchTasksEndPoint(req, res, next) {
  req.checkQuery(schemas.searchTasksEndpointSchema);
  return sendValidationError(req, res, next);
}

function validateSuggestTasksEndPoint(req, res, next) {
  req.checkQuery(schemas.suggestTasksEndpointSchema);
  return sendValidationError(req, res, next);
}

function validateTask(req, res, next) {
  req.checkBody(schemas.taskSchema);
  return sendValidationError(req, res, next);
}

module.exports = {
  validateTask,
  validateGetTasksEndPoint,
  validateSearchTasksEndPoint,
  validateSuggestTasksEndPoint
};
