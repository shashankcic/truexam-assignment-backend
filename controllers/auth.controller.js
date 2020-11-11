//Imports
const User = require("../models/User");
const asyncHandlers = require('../middlewares/async');

//Variable
const authCtrl = {};

// @Method: POST
// @Route : api/auth/register 
// @Desc  : Handling the user registration
authCtrl.registerUser = asyncHandlers(async (req, res) => {
  const { name, username, email, role, password } = req.body;

  if(!email || !password){
    return res.status(400).json({success: false, message: "Please enter all the fields."});
  }

  let userEmail = await User.findOne({email});

  if(userEmail) {
    return res.status(400).json({success: false, message: 'User already exists'})
  }

  let userUsername = await User.findOne({username});

  if(userUsername) {
    return res.status(400).json({success: false, message: 'Choose a different username'})
  }

  user = await User.create({
    name, username, email, role, password
  });

  const token = await user.generateAuthToken();

  res.status(200).json({success: true, token: token});
  // try {
  //   newUser.password = await newUser.encryptPassword(newUser.password);
  //   await newUser.save();
  //   res.status(201).send({ created: true });
  // } catch (error) {
  //   res.status(400).send({ error });
  // }
});

// @Method: POST
// @Route : api/auth/login 
// @Desc  : Logging in the user
authCtrl.loginUser = asyncHandlers(async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return res.status(400).json({success: false, message: "Please enter all the fields."});
  }
  
  const user = await User.findByCredentials(email, password);

  if (!user) {
    return res.status(404).json({success: false, message: "Invalid Creds.."});
  }

  const token = await user.generateAuthToken();

  return res.status(200).json({success: true, token: token});
});

// @Method: GET
// @Route : api/auth/me 
// @Desc  : Get the user on load if token available in browser
authCtrl.getMe = asyncHandlers(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  return res.status(200).json({success: true, data: user});
});

authCtrl.changeRole = asyncHandlers(async (req, res, next) => {
  const role = req.body.role;
  const user = await User.findById(req.params.id);
  await user.changeRoles(role);

  // const token = await user.generateAuthToken();

  return res.status(200).json({success:true, message: "Role updated successfully"});
})

//Export router
module.exports = authCtrl;