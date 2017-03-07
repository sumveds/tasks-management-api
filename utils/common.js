function buildError(err) {
  const error = new Error(err.message);
  error.name = err.name;
  error.details = err.stack;
  return error;
}

function buildGetTasksQueryParams(query) {
  const { ending_before, created_after, created_by } = query;
  const dbQueryParams = {};
  const ONE_DAY = 1000 * 60 * 60 * 24;
  if (ending_before) {
    dbQueryParams['endDate'] = { $lt: new Date(ending_before) };
  }
  if (created_after) {
    dbQueryParams['createdAt'] = { $gt: +new Date(created_after) + ONE_DAY };
  }
  if (created_by) {
    // NOTE Regex way of comparing task author is not efficient when
    //      we have millions of records.
    dbQueryParams['createdBy'] = new RegExp(`^${created_by}$`, 'i');
  }
  return dbQueryParams;
}

module.exports = {
  buildError,
  buildGetTasksQueryParams
};
