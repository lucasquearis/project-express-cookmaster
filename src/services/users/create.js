const createUserModel = require('../../models/users/create');

const create = (name, email, password) => createUserModel.create(name, email, password);

module.exports = { create };