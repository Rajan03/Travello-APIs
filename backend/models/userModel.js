const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is a required field!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a email address!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        // If true, validation passed and no error.
        // Execute only on Create() and Save(); not on update
        return el === this.password;
      },
      message: 'Passwords do not match!!',
    },
  },
});

userSchema.pre('save', async function (next) {
  // If password not modified, return
  if (!this.isModified('password')) return next();

  // Hashing password
  this.password = await bcrypt.hash(this.password, 12);

  // Remove confirm password field
  this.passwordConfirm = undefined;

  next();
});

// Instance method
userSchema.methods.isCorrectPassword = async function (
  inputPassword,
  actualPassword
) {
  return await bcrypt.compare(inputPassword, actualPassword);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
