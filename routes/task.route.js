//Imports
const { Router } = require("express");
const router = Router();
const {
  getTasks,
  getTaskBySlug,
  getTaskById,
  createTask,
  deleteTask,
  updateTask,
  updateScore,
  addSubmissionByTaskId,
  addSubmissionByTaskSlug,
  getSubmissionsByTaskId,
  getSubmissionsByTaskSlug,
  getSubmissionBySubmissionId
} = require("../controllers/task.controller");
const { protect, authorize } = require('../middlewares/auth');

//Routes
router.get("/", getTasks);
router.get("/:slug", getTaskBySlug);
router.get("/id/:id", getTaskById);

//For Instructor
router.post("/", protect, authorize('instructor', 'admin'), createTask);
router.put("/:id", protect, authorize('instructor', 'admin'), updateTask);
router.delete("/:id", protect, authorize('instructor', 'admin'), deleteTask);
router.put("/submission/:taskId/:subId", protect, authorize('instructor', 'admin'), updateScore);
router.get("/submissions/id/:id", protect, authorize('instructor', 'admin'), getSubmissionsByTaskId);
router.get("/submissions/:slug", protect, authorize('instructor', 'admin'), getSubmissionsByTaskSlug);

//For User
router.put("/submit/id/:id", protect, authorize('user', 'admin'), addSubmissionByTaskId);
router.put("/submit/:slug", protect, authorize('user', 'admin'), addSubmissionByTaskSlug);

//For registered
router.get("/submission/:taskId/:subId", protect, authorize('user','instructor', 'admin'), getSubmissionBySubmissionId); 

//Export
module.exports = router;
