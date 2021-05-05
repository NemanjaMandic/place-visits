const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/HttpError');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again', 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed', 422));
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Signup failed, try again', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User with that email already exists', 422);
    return next(error);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError('Could not create user, please try again', 500);
    return next(err);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed', 500);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      'supersecret',
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    const error = new HttpError('Signing up failed', 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Loging in failed, try again', 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('Invalid credentials passed', 422);
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    const err = new HttpError(
      'Could not log you in, please check your credentials',
      500
    );
    return next(err);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials passed', 422);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      'supersecret',
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    const error = new HttpError('Loging in up failed', 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
