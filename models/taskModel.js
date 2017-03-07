const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;
const TaskSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 36,
      required: [true, 'Task name cannot be blank.']
    },
    description: {
      type: String,
      maxlength: 160,
      required: [true, 'Task description cannot be blank.']
    },
    createdBy: {
      type: String,
      maxlength: 36,
      required: [true, 'Task author cannot be blank.']
    },
    endDate: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

// NOTE Added index for unit testing of full text search.
if (process.env.NODE_ENV === 'test') {
  TaskSchema.index({ name: 'text', description: 'text' });
}

// Sets the createdAt parameter equal to the current time
TaskSchema.pre('save', (next) => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  // Conversion of string to date object.
  this.endDate = new Date(this.endDate);
  // Denormalize the username to store as lower-case
  // this.createdBy = this.createdBy.toLowerCase();
  next();
});

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('task', TaskSchema);
