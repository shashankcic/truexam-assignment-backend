const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//User Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    username: {
      type: String,
      required: [true, "Please add a username"],
      trim: true,
      minlength: [6, "Very short username"],
      maxlength: [18, "Too long username"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    role: {
      type: String,
      enum: ['user', 'instructor', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Very short password"],
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Hashing the password before saving to db.
userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  };
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Static methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else {
      throw new Error("Unable to login");
    }
  } else {
    throw new Error({ error: "Unable to login" });
  }
};

//User methods for generating auth token.

userSchema.methods.generateAuthToken = async function () {
  return jwt.sign({id: this._id}, process.env.AUTHTOKENSTRING, {expiresIn: process.env.JWT_EXPIRES});
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return userObject.tokens;
};

//Comparing the entered password with hashed password
userSchema.methods.verifyPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.changeRoles = async function(role) {
  const user = this;

  user.role = role;

  try {
    await user.save();
  } catch (error) {
    throw new Error(error);
  }
}

const User = model("User", userSchema);

//Export
module.exports = User;