const connection = require('../connection');

const create = async (recipe) => connection()
    .then((db) => db.collection('recipes').insertOne(recipe))
    .then(({ ops }) => {
      const [firstElement] = ops;
      return firstElement;
    });

module.exports = { create };