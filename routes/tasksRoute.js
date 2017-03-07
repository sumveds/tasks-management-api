const tasksController = require('../controllers/tasksController');
const validators = require('../utils/validators');

const express = require('express');
const router = express.Router();

router.route('/')
  .get(validators.validateGetTasksEndPoint, tasksController.getTasks)
  .post(validators.validateTask, tasksController.createTask);

router.route('/suggestions')
  .get(validators.validateSuggestTasksEndPoint, tasksController.suggestTasks);

router.route('/search')
  .get(validators.validateSearchTasksEndPoint, tasksController.searchTasks);

router.route("/:id")
  .get(tasksController.getTask)
  .put(validators.validateTask, tasksController.updateTask)
  .delete(tasksController.deleteTask);

module.exports = router;
