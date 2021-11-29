const connection = require('../connection');

const findByEmail = (email) => connection()
    .then((db) => db.collection('users').findOne({ email }))
    .then((result) => result);

module.exports = { findByEmail };