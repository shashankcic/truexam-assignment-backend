const { Router } = require("express");
const router = Router();
const { registerUser, loginUser, getMe, changeRole } = require("../controllers/auth.controller");
const { protect, authorize } = require('../middlewares/auth');

//Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

//Route with authorization example for roles.
router.put('/role/:id', protect, authorize('admin'), changeRole);

module.exports = router;