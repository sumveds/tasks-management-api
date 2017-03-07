const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const express = require('express');
const router = new express.Router();
const { OK, CREATED, NO_CONTENT, NOT_FOUND } = require('http-status-codes');

const Task = require('../models/taskModel');
const { buildError, buildGetTasksQueryParams } = require('../utils/common');

/*
 * POST /tasks to create a new task.
 */
function createTask(req, res, next) {
  new Task(req.body).save().then((task) => {
    res.status(CREATED).json(task);
  }).catch((err) => {
    next(buildError(err));
  });
}

/*
 * GET /tasks/:id route to retrieve a task by id.
 */
function getTask(req, res, next) {
  Task.findById({_id: req.params.id}).exec().then((task) => {
    if (task) res.status(OK).json(task);
    else res.sendStatus(NOT_FOUND);
  }).catch((err) => {
    next(buildError(err));
  });
}

/*
 * GET /tasks to retrieve all the tasks.
 * NOTE: Pagination not supported as of now as the scope of this
 *       project is limited only to assignment.
 */
function getTasks(req, res, next) {
  const dbQueryParams = buildGetTasksQueryParams(req.query);
  Task.find(dbQueryParams).exec().then((tasks) => {
    res.status(OK).json(tasks);
  }).catch((err) => {
    next(buildError(err));
  });
}

/*
 * PUT /tasks/:id to update a task by id
 */
function updateTask(req, res, next) {
  Task.findById({_id: req.params.id}).exec().then((task) => {
    return Object.assign(task, req.body).save();
  }).then((task) => {
    res.status(OK).json(task);
  }).catch((err) => {
    next(buildError(err));
  });
}

/*
 * DELETE /tasks/:id to delete a task by id.
 */
function deleteTask(req, res, next) {
  Task.remove({_id : req.params.id}).then((result) => {
    res.sendStatus(NO_CONTENT);
  }).catch((err) => {
    next(buildError(err));
  });
}

/*
 * GET /tasks/search?term={term} to search tasks.
 * NOTE: MongoDB doesn't support partial text search.
 */
function searchTasks(req, res, next) {
  const { term } = req.query;
  Task.find(
    { $text : { $search : term } },
    { score : { $meta: "textScore" } }
  ).sort(
    { score : { $meta : 'textScore' } }
  ).exec().then((tasks) => {
    res.status(OK).json(tasks);
  }).catch((err) => {
    next(buildError(err));
  });
}

/*
 * GET /tasks/suggestions?starts_with={starts_with} to suggest tasks.
 * NOTE: Regex search is slow when we are searching from million records.
 */
function suggestTasks(req, res, next) {
  const { starts_with } = req.query;
  Task.find(
    { name: { $regex: new RegExp(`^${starts_with}`, 'i') } }
  ).exec().then((tasks) => {
    res.status(OK).json(tasks);
  }).catch((err) => {
    next(buildError(err));
  });
}

//export all the functions
module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  searchTasks,
  suggestTasks
};
