const mongoose = require('mongoose');
const crypto = require('crypto');
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
    enum: ['user', 'admin', 'guide', 'leadGuide'],
    default: 'user',
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Middleware
userSchema.pre('save', function (next) {
  // If password not modified, return
  if (!this.isModified('password') || this.isNew) return next();

  // To make sure token is always created after the password is updated
  this.passwordChangedAt = Date.now() - 1000;
  next();
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

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Instance method
userSchema.methods.isCorrectPassword = async function (
  inputPassword,
  actualPassword
) {
  return await bcrypt.compare(inputPassword, actualPassword);
};

userSchema.methods.passwordChanged = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const changedAtInSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtIssuedAt < changedAtInSeconds;
  }
  // Not Changed
  return false;
};

userSchema.methods.genratePswResetToken = function () {
  // Random token by inbuilt node module crypto
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hashing token to store in DB (Not req to be hashed that strongly)
  // sha256 Algorithm used to hash
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  // Here user object is modified by generating the token and not saving it in DB.
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
