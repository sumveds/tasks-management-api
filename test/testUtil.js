const createTaskRequest = {
  method: 'POST',
  url: '/tasks',
  body: {
    name: 'Test_Task',
    description: 'Test task description',
    createdBy: 'TestUser',
    endDate: '2017-12-27'
  }
};

const failUpdateTaskRequest = {
  method: 'PUT',
  url: '/tasks/:id',
  params: {
    id: 'fake_task_id'
  },
  body: {
    name: 'Test_Task'
  }
};

const searchTasksRequest = {
  method: 'GET',
  url: '/tasks/search',
  query: {
    term: 'Test'
  }
};

const suggestTasksRequest = {
  method: 'GET',
  url: '/tasks/suggestions',
  query: {
    starts_with: 'Tes'
  }
};

const failDeleteTaskRequest = {
  method: 'DELETE',
  url: '/tasks/:id',
  params: {
    id: '1234'
  }
};

const failGetTaskRequest = {
  method: 'GET',
  url: '/tasks/:id',
  params: {
    id: '1234'
  }
};

const failSuggestTasksRequest = {
  method: 'GET',
  url: '/tasks/suggests',
  query: {
    starts_with: ''
  }
};

const createTaskBadRequest = {
  method: 'POST',
  url: '/tasks',
  body: {
    description: 'Test task description',
    createdBy: 'TestUser',
    endDate: '2017-12-27'
  }
};

function getUpdateTaskByIdRequest(taskId) {
  return {
    method: 'PUT',
    url: '/tasks/:id',
    params: {
      id: taskId
    },
    body: {
      name: 'Updated_Test_Task',
      description: 'Update test task description',
      createdBy: 'TestUser',
      endDate: '2017-12-27'
    }
  };
}

module.exports = {
  createTaskRequest,
  failUpdateTaskRequest,
  getUpdateTaskByIdRequest,
  searchTasksRequest,
  suggestTasksRequest,
  failDeleteTaskRequest,
  failGetTaskRequest,
  createTaskBadRequest,
  failSuggestTasksRequest
};
