process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;

const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const { CREATED, OK, NO_CONTENT } = require('http-status-codes');

const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
mockgoose(mongoose);

const Task = require('../models/taskModel');
const TasksController = require('../controllers/tasksController');
const TestUtil = require('./testUtil.js');

describe('Tasks controller', () => {
  const TIMEOUT = 500;
  before((done) => {
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/TestingDB').then(() =>  {
        // console.log('In-memory database connection successful');
        done();
      }).catch((err) => {
        console.error.bind(console, 'In-memory database connection error: ');
        done(err);
      });
    });
  });

  after(() => {
    mockgoose.reset();
    mongoose.connection.close();
  });

  afterEach(() => {
    Task.remove({}).then((result) => {
      // console.log('All data removed.');
    }).catch((err) => {
      console.error(`Remove data after running test failed: ${err.message}`);
    });
  });

  it('should create a task successfully', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(function() {
        expect(response.statusCode).to.equal(CREATED);
        const task = JSON.parse(response._getData());
        expect(task).to.be.an('object');
        expect(task._id).to.not.be.an('undefined');
        expect(task.name).to.equal(request.body.name);
        expect(task.description).to.equal(request.body.description);
        expect(task.createdBy).to.equal(request.body.createdBy);
        expect(task.endDate).to.equal(request.body.endDate + 'T00:00:00.000Z');
        expect(task.createdAt).to.not.be.an('undefined');
        done();
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should fetch all the tasks', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(() => {
        const getAllTasksRequest = {
          method: 'GET',
          url: '/tasks',
          query: {}
        };
        const getAllTasksResponse = httpMocks.createResponse();
        TasksController.getTasks(getAllTasksRequest, getAllTasksResponse);
        setTimeout(function() {
          expect(getAllTasksResponse.statusCode).to.equal(OK);
          const tasks = JSON.parse(getAllTasksResponse._getData());
          expect(tasks).to.be.an('array');
          expect(tasks.length).to.equal(1);
          expect(tasks[0]._id).to.not.be.an('undefined');
          expect(tasks[0].name).to.equal(request.body.name);
          expect(tasks[0].description).to.equal(request.body.description);
          expect(tasks[0].createdBy).to.equal(request.body.createdBy);
          expect(tasks[0].endDate).to.equal(request.body.endDate + 'T00:00:00.000Z');
          expect(tasks[0].createdAt).to.not.be.an('undefined');
          done();
        }, TIMEOUT);
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should fetch all the tasks ending before specific date', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(() => {
        const getAllTasksRequest = {
          method: 'GET',
          url: '/tasks',
          query: {
            ending_before: '2017-12-28'
          }
        };
        const getAllTasksResponse = httpMocks.createResponse();
        TasksController.getTasks(getAllTasksRequest, getAllTasksResponse);
        setTimeout(function() {
          expect(getAllTasksResponse.statusCode).to.equal(OK);
          const tasks = JSON.parse(getAllTasksResponse._getData());
          expect(tasks).to.be.an('array');
          expect(tasks.length).to.equal(1);
          expect(tasks[0]._id).to.not.be.an('undefined');
          expect(tasks[0].name).to.equal(request.body.name);
          expect(tasks[0].description).to.equal(request.body.description);
          expect(tasks[0].createdBy).to.equal(request.body.createdBy);
          expect(tasks[0].endDate).to.equal(request.body.endDate + 'T00:00:00.000Z');
          expect(tasks[0].createdAt).to.not.be.an('undefined');
          done();
        }, TIMEOUT);
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should fetch all the tasks created after specific date', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(() => {
        const getAllTasksRequest = {
          method: 'GET',
          url: '/tasks',
          query: {
            created_after: '2016-02-22'
          }
        };
        const getAllTasksResponse = httpMocks.createResponse();
        TasksController.getTasks(getAllTasksRequest, getAllTasksResponse);
        setTimeout(function() {
          expect(getAllTasksResponse.statusCode).to.equal(OK);
          const tasks = JSON.parse(getAllTasksResponse._getData());
          expect(tasks).to.be.an('array');
          expect(tasks.length).to.equal(1);
          expect(tasks[0]._id).to.not.be.an('undefined');
          expect(tasks[0].name).to.equal(request.body.name);
          expect(tasks[0].description).to.equal(request.body.description);
          expect(tasks[0].createdBy).to.equal(request.body.createdBy);
          expect(tasks[0].endDate).to.equal(request.body.endDate + 'T00:00:00.000Z');
          expect(tasks[0].createdAt).to.not.be.an('undefined');
          done();
        }, TIMEOUT);
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should fetch all the tasks created by a user', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(() => {
        const getAllTasksRequest = {
          method: 'GET',
          url: '/tasks',
          query: {
            created_by: 'TestUser'
          }
        };
        const getAllTasksResponse = httpMocks.createResponse();
        TasksController.getTasks(getAllTasksRequest, getAllTasksResponse);
        setTimeout(() => {
          expect(getAllTasksResponse.statusCode).to.equal(OK);
          const tasks = JSON.parse(getAllTasksResponse._getData());
          expect(tasks).to.be.an('array');
          expect(tasks.length).to.equal(1);
          expect(tasks[0]._id).to.not.be.an('undefined');
          expect(tasks[0].name).to.equal(request.body.name);
          expect(tasks[0].description).to.equal(request.body.description);
          expect(tasks[0].createdBy).to.equal(request.body.createdBy);
          expect(tasks[0].endDate).to.equal(request.body.endDate + 'T00:00:00.000Z');
          expect(tasks[0].createdAt).to.not.be.an('undefined');
          done();
        }, TIMEOUT);
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should suggest tasks', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(() => {
        const suggestTasksRequest = TestUtil.suggestTasksRequest;
        const suggestTasksResponse = httpMocks.createResponse();
        TasksController.suggestTasks(suggestTasksRequest, suggestTasksResponse);
        setTimeout(() => {
          expect(suggestTasksResponse.statusCode).to.equal(OK);
          const tasks = JSON.parse(suggestTasksResponse._getData());
          expect(tasks).to.be.an('array');
          expect(tasks.length).to.equal(1);
          expect(tasks[0]._id).to.not.be.an('undefined');
          expect(tasks[0].name.startsWith(
            suggestTasksRequest.query.starts_with)).to.true;
          done();
        }, TIMEOUT);
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should search tasks', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(function () {
        const searchTasksRequest = TestUtil.searchTasksRequest;
        const searchTasksResponse = httpMocks.createResponse();
        TasksController.searchTasks(searchTasksRequest, searchTasksResponse);
        setTimeout(function() {
          expect(searchTasksResponse.statusCode).to.equal(OK);
          const tasks = JSON.parse(searchTasksResponse._getData());
          expect(tasks).to.be.an('array');
          expect(tasks[0]).to.not.be.an('undefined');
          expect(tasks[0]._id).to.not.be.an('undefined');
          const term = searchTasksRequest.query.term;
          const searchMatched = tasks[0].name.includes(term) ||
            tasks[0].description.includes(term);
          expect(searchMatched).to.true;
          done();
        }, TIMEOUT);
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should fetch a task by id', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(function() {
        const task = JSON.parse(response._getData());
        const getTaskRequest = {
          method: 'GET',
          url: '/tasks/:id',
          params: {
            id: task._id
          }
        };
        const getTaskResponse = httpMocks.createResponse();
        TasksController.getTask(getTaskRequest, getTaskResponse);
        setTimeout(function() {
          expect(getTaskResponse.statusCode).to.equal(OK);
          const result = JSON.parse(getTaskResponse._getData());
          expect(result).to.be.an('object');
          expect(result._id).to.not.be.an(task._id);
          expect(result.name).to.equal(task.name);
          expect(result.description).to.equal(task.description);
          expect(result.createdBy).to.equal(task.createdBy);
          expect(result.endDate).to.equal(task.endDate);
          expect(result.createdAt).to.equal(task.createdAt);
          done();
        }, TIMEOUT);
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should delete a task successfully', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(function() {
        const task = JSON.parse(response._getData());
        const deleteTaskRequest = {
          method: 'DELETE',
          url: '/tasks/:id',
          params: {
            id: task._id
          }
        };
        const deleteTaskResponse = httpMocks.createResponse();
        TasksController.deleteTask(deleteTaskRequest, deleteTaskResponse);
        setTimeout(function() {
          expect(deleteTaskResponse.statusCode).to.equal(NO_CONTENT);
          done();
        }, TIMEOUT);
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should fail to update task without task name', (done) => {
    try {
      const updateTaskRequest = TestUtil.failUpdateTaskRequest;
      const updateTaskResponse = httpMocks.createResponse();
      const next = sinon.spy();
      TasksController.updateTask(updateTaskRequest, updateTaskResponse, next);
      setTimeout(function() {
        expect(next).to.have.been.called;
        done();
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should update a task successfully', (done) => {
    try {
      const request = TestUtil.createTaskRequest;
      const response = httpMocks.createResponse();
      TasksController.createTask(request, response);
      setTimeout(function() {
        const task = JSON.parse(response._getData());
        const updateTaskRequest = TestUtil.getUpdateTaskByIdRequest(task._id);
        const updateTaskResponse = httpMocks.createResponse();
        TasksController.updateTask(updateTaskRequest, updateTaskResponse);
        setTimeout(function() {
          expect(updateTaskResponse.statusCode).to.equal(OK);
          const result = JSON.parse(updateTaskResponse._getData());
          expect(result).to.be.an('object');
          expect(result._id).to.equal(task._id);
          expect(result.name).to.equal(updateTaskRequest.body.name);
          expect(result.description).to.equal(updateTaskRequest.body.description);
          expect(result.createdBy).to.equal(updateTaskRequest.body.createdBy);
          expect(result.endDate).to.equal(updateTaskRequest.body.endDate + 'T00:00:00.000Z');
          expect(result.createdAt).to.equal(task.createdAt);
          done();
        }, TIMEOUT);
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should fail a task creation and call middleware function', (done) => {
    try {
      const request = TestUtil.createTaskBadRequest;
      let response = httpMocks.createResponse();
      const next = sinon.spy();
      TasksController.createTask(request, response, next);
      setTimeout(function() {
        expect(next).to.have.been.called;
        done();
      }, TIMEOUT);
    } catch(e) {
      done(e);
    }
  });

  it('should not fetch task and call the next middleware function', (done) => {
    try {
      const request = TestUtil.failGetTaskRequest;
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      TasksController.getTask(request, response, next);
      setTimeout(function() {
        expect(next).to.have.been.called;
        done();
      }, TIMEOUT);
    } catch(err) {
      done(err);
    }
  });

  it('should not delete task and call the next middleware function', (done) => {
    try {
      const request = TestUtil.failDeleteTaskRequest;
      const response = httpMocks.createResponse();
      const next = sinon.spy();
      TasksController.deleteTask(request, response, next);
      setTimeout(function() {
        expect(next).to.have.been.called;
        done();
      }, TIMEOUT);
    } catch(err) {
      done(err);
    }
  });

});
