const { ObjectId } = require('mongodb');
const connection = require('../connection');

const remove = async (id) => connection()
    .then((db) => db.collection('recipes').deleteOne({ _id: ObjectId(id) }))
    .then((response) => response);

module.exports = { remove };