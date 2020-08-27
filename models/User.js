const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The user name must have a name'],
    },
    email: {
      type: String,
      required: [true, 'User Email must have Email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email invalid format'],
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },

    password: {
      type: String,
      required: [true, 'Please choose a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'No match',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
);
//Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  //Incrypt password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

//To compare hashed password with incoming password we cant use this
//password select:false
//so we use arrow function
userSchema.methods.correctPassword = async (incomingPassword, savedPassword) =>
  await bcrypt.compare(incomingPassword, savedPassword);
//Check if password was changed.By default returns false
userSchema.methods.passwordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < passwordChangedTimestamp; //100<200 changed returns true
    //if password wasn't changed return false
  }
};

//Reset Password method
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log('resetToken', resetToken);
  console.log('this.passwordResetToken', this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 600 * 1000; //10min in milliseconds

  return resetToken;
};
//In reset password modify passwordChangedAt
userSchema.pre('save', function (next) {
  //if password not changed or is new then pass through this middleware
  if (!this.isModified('password') || this.isNew) return next();
  //if password modified
  //token can be issued before new password saved to DB
  // to avoid situation we substract 1 sec from passwordChangedAt
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
