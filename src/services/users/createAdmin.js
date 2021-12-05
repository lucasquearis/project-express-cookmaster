const createUserModel = require('../../models/users/create');

const createAdmin = async (name, email, password) => {
  const newUser = await createUserModel.create(name, email, password, 'admin');
  const { role, _id } = newUser;
  return { user: { name, email, role, _id } };
};

module.exports = { createAdmin };