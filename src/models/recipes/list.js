const connection = require('../connection');

const list = () => connection()
    .then((db) => db.collection('recipes').find().toArray());

module.exports = { list };