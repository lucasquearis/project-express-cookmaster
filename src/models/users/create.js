const connection = require('../connection');

const create = (name, email, password, role) => connection()
    .then((db) => db.collection('users').insertOne({ name, email, password, role }))
    .then(({ ops }) => {
      const [firstElement] = ops;
      console.log(firstElement);
      return firstElement;
    });

module.exports = { create };