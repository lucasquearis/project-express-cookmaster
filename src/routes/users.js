const express = require('express');
const { create } = require('../controllers/users/create');
const { validateUser } = require('../middlewares/validateUser');
const { createAdmin } = require('../controllers/users/createAdmin');
const { validateAdmin } = require('../middlewares/validateAdmin');

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post('/', validateUser, create);
usersRouter.post('/admin', validateUser, validateAdmin, createAdmin);

module.exports = { usersRouter };