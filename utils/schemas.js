const taskSchema = {
  'name': {
    in: 'body',
    notEmpty: true,
    isLength: {
      options: [{ min: 2, max: 36 }],
      errorMessage: 'Must be between 2 and 36 chars long'
    },
    errorMessage: 'Invalid name'
  },
  'description': {
    in: 'body',
    notEmpty: true,
    isLength: {
      options: [{ min: 2, max: 160 }],
      errorMessage: 'Must be between 2 and 160 chars long'
    },
    errorMessage: 'Invalid description'
  },
  'createdBy': {
    in: 'body',
    notEmpty: true,
    isLength: {
      options: [{ min: 2, max: 36 }],
      errorMessage: 'Must be between 2 and 36 chars long'
    },
    errorMessage: 'Invalid createdBy'
  },
  'endDate': {
    in: 'body',
    isDateFormat: {
      errorMessage: 'Invalid endDate'
    }
  }
};

const getTasksEndpointSchema = {
  'created_after': {
    in: 'query',
    optional: true,
    isDateFormat: {
      errorMessage: 'Invalid created_after'
    }
  },
  'ending_before': {
    in: 'query',
    optional: true,
    isDateFormat: {
      errorMessage: 'Invalid ending_before'
    }
  }
}

const searchTasksEndpointSchema = {
  'term': {
    in: 'query',
    notEmpty: true,
    errorMessage: 'Invalid search term'
  }
}

const suggestTasksEndpointSchema = {
  'starts_with': {
    in: 'query',
    notEmpty: true,
    errorMessage: 'Invalid task name initial'
  }
}

module.exports = {
  taskSchema,
  getTasksEndpointSchema,
  searchTasksEndpointSchema,
  suggestTasksEndpointSchema
};
