const listModel = require('../../models/recipes/list');

const list = async () => listModel.list();

module.exports = { list };