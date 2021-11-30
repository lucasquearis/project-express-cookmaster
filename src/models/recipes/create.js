const connection = require('../connection');

const create = async (name, ingredients, preparation, userId) => connection()
    .then((db) => db.collection('recipes').insertOne(
      {
        name,
        ingredients,
        preparation,
        userId,
      },
    ))
    .then(({ ops }) => {
      const [firstElement] = ops;
      return firstElement;
    });

module.exports = { create };