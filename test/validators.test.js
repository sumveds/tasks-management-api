process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;

const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const { OK, BAD_REQUEST } = require('http-status-codes');

const Validators = require('../utils/validators');

describe('Validators util', () => {
  it('should validate create task request and fail', (done) => {
    try {
      const validationErrorsStub = sinon.stub();
      validationErrorsStub.returns([
        { param: 'endDate', msg: 'Invalid endDate' }
      ]);
      const req = {
        method: 'POST',
        url: '/tasks',
        body: {
          name: 'Test_Task',
          description: 'Test task description',
          createdBy: 'TestUser'
        },
        checkBody: sinon.spy(),
        validationErrors: validationErrorsStub
      };
      const res = httpMocks.createResponse();
      const next = sinon.spy();
      Validators.validateTask(req, res, next);
      // expect(next).to.have.been.called;
      expect(res._getStatusCode()).to.equal(BAD_REQUEST);
      const result = JSON.parse(res._getData());
      expect(result.message).to.equal('Bad Request');
      expect(result.errors).to.be.an('array');
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should pass when no validation error occurs', (done) => {
    try {
      const validationErrorsStub = sinon.stub();
      validationErrorsStub.returns([]);
      const req = {
        method: 'POST',
        url: '/tasks',
        body: {
          name: 'Test_Task',
          description: 'Test task description',
          createdBy: 'TestUser',
          endDate: '2017-12-27'
        },
        checkBody: sinon.spy(),
        validationErrors: validationErrorsStub
      };
      const res = httpMocks.createResponse();
      const next = sinon.spy();
      Validators.validateTask(req, res, next);
      expect(next).to.have.been.called;
      expect(res._getStatusCode()).to.equal(OK);
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should fail get tasks request', (done) => {
    try {
      const validationErrorsStub = sinon.stub();
      validationErrorsStub.returns([{
        param: 'created_after',
        msg: 'Invalid created_after',
        value: ''
      }]);
      const req = {
        method: 'GET',
        url: '/tasks',
        query: {
          created_after: ''
        },
        checkQuery: sinon.spy(),
        validationErrors: validationErrorsStub
      };
      const res = httpMocks.createResponse();
      const next = sinon.spy();
      Validators.validateGetTasksEndPoint(req, res, next);
      expect(res._getStatusCode()).to.equal(BAD_REQUEST);
      const result = JSON.parse(res._getData());
      expect(result.message).to.equal('Bad Request');
      expect(result.errors).to.be.an('array');
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should fail search tasks request', (done) => {
    try {
      const validationErrorsStub = sinon.stub();
      validationErrorsStub.returns([{
        param: 'term',
        msg: 'Invalid term',
        value: ''
      }]);
      const req = {
        method: 'GET',
        url: '/tasks/search',
        query: {
          term: ''
        },
        checkQuery: sinon.spy(),
        validationErrors: validationErrorsStub
      };
      const res = httpMocks.createResponse();
      const next = sinon.spy();
      Validators.validateSearchTasksEndPoint(req, res, next);
      expect(res._getStatusCode()).to.equal(BAD_REQUEST);
      const result = JSON.parse(res._getData());
      expect(result.message).to.equal('Bad Request');
      expect(result.errors).to.be.an('array');
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should fail suggest tasks request', (done) => {
    try {
      const validationErrorsStub = sinon.stub();
      validationErrorsStub.returns([{
        param: 'starts_with',
        msg: 'Invalid task name initial',
        value: ''
      }]);
      const req = {
        method: 'GET',
        url: '/tasks/suggestions',
        query: {
          starts_with: ''
        },
        checkQuery: sinon.spy(),
        validationErrors: validationErrorsStub
      };
      const res = httpMocks.createResponse();
      const next = sinon.spy();
      Validators.validateSuggestTasksEndPoint(req, res, next);
      expect(res._getStatusCode()).to.equal(BAD_REQUEST);
      const result = JSON.parse(res._getData());
      expect(result.message).to.equal('Bad Request');
      expect(result.errors).to.be.an('array');
      done();
    } catch(e) {
      done(e);
    }
  });
});
