const { Schema, model } = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const submissionSchema = new Schema(
  {
    image: {
      type: String,
      required: [true, "Image not given"],
    },
    userId: {
      type: String,
      required: [true, "User not specified"],
    },
    score: {
      type: Number,
      min: [-1, "Score should be a positive value"],
      max: [10, "Score should be a value less than 10"],
      default: -1
    },
  },
  {
    timestamps: true,
  },
);

//Task Schema
const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a task name"]
    },
    description: {
      type: String,
      required: [true, "Please add a task description"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image for task"],
    },
    instructor: {
      type: String,
      required: [true, "Please provide the name of the instructor"],
    },
    submissions: [submissionSchema],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.pre("validate", function(next) {
  const task = this;
  
  if(task.name) {
    task.slug = slugify(task.name, { lower: true, strict: true });
  }

  next();
})

const Task = model("Task", taskSchema);

//Export
module.exports = Task;