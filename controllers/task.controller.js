//Imports
const Task = require("../models/Task");

//Object
const TaskCtrl = {};

//Functions

TaskCtrl.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    if (tasks) {
      res.status(200).send(tasks);
    } else {
      res.status(404).send({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

TaskCtrl.createTask = async (req, res) => {
  const newTask = new Task(req.body);
  try {
    await newTask.save();
    res.status(200).send({ message: "Task Created" });
  } catch (error) {
    res.status(500).send(error);
  }
};

TaskCtrl.getTaskBySlug = async (req, res) => {
  try {
    const task = await Task.findOne({slug: req.params.slug});
    res.status(200).send(task);
  } catch (err) {
    res.status(404).send(err);
  }
};

TaskCtrl.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).send(task);
  } catch (err) {
    res.status(404).send(err);
  }
};

TaskCtrl.updateTask = async (req, res) => {
  const { name, description, image, instructor, submissions } = req.body;
  try {
    await Task.findOneAndUpdate(
      { _id: req.params.id },
      { name, description, image, instructor, submissions }
    );
    res.status(200).send({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};

TaskCtrl.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id });
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};

TaskCtrl.addSubmissionByTaskId = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.submissions.push({
      image: req.body.image,
      userId: req.body.userId,
      score: req.body.score,
    })
    await task.save();
    res.status(200).send({ message: "Submission added successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
}

TaskCtrl.addSubmissionByTaskSlug = async (req, res) => {
  try {
    const task = await Task.findOne({slug: req.params.slug});
    task.submissions.push({
      image: req.body.image,
      userId: req.body.userId,
      score: req.body.score,
    })
    await task.save();
    res.status(200).send({ message: "Submission added successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
}

TaskCtrl.updateScore = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const submission = await task.submissions.id(req.params.subId);
    submission.score = req.body.score;
    await task.save();
    res.status(200).send({ message: "Score updated successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};

TaskCtrl.getSubmissionsByTaskId = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      if(task.submissions) {
        res.status(200).send(task.submissions);
      } else {
        res.status(200).send({message: "No submissions yet!"})
      }
    } else {
      res.status(404).send({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

TaskCtrl.getSubmissionsByTaskSlug = async (req, res) => {
  try {
    const task = await Task.findOne({slug: req.params.slug});
    if (task) {
      if(task.submissions) {
        res.status(200).send(task.submissions);
      } else {
        res.status(200).send({message: "No submissions yet!"})
      }
    } else {
      res.status(404).send({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

TaskCtrl.getSubmissionBySubmissionId = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const submission = await task.submissions.id(req.params.subId);
    res.status(200).send(submission);
  } catch (err) {
    res.status(404).send(err);
  }
};

//Export
module.exports = TaskCtrl;