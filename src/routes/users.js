const express = require('express');
const { create } = require('../controllers/users/create');
const { validateUser } = require('../middlewares/validateUser');
const { createAdmin } = require('../controllers/users/createAdmin');

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post('/', validateUser, create);
usersRouter.post('/admin', validateUser, createAdmin);

module.exports = { usersRouter };