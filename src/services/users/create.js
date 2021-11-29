const createUserModel = require('../../models/users/create');

const create = async (name, email, password) => {
  const newUser = await createUserModel.create(name, email, password, 'user');
  const { role, _id } = newUser;
  return { user: { name, email, role, _id } };
};

module.exports = { create };