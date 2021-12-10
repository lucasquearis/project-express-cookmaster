const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const server = require('../../api/app');
const { StatusCodes } = require('http-status-codes');
const MongoClientMock = require('../connectionMock');
const createRecipeModel = require('../../models/recipes/create');

const TEST_ID = '61aa4ef8a3036a53a1fbe889';


chai.use(chaiHttp);

const { expect } = chai;

describe('GET /images/:image', () => {
  let recipeId;
  before(async () => {
    const connectionMock = await MongoClientMock()
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    const db = await connectionMock.db('Cookmaster')
    const users = await db.collection('users');
    await users.deleteMany({});
    const recipes = await db.collection('recipes');
    await recipes.deleteMany({});
    const { _id }  = await createRecipeModel.create({
      name: 'pizza',
      ingredients: 'queijo, tomate',
      preparation: '10 min no forno',
      userId: '123455134',
      image: 'localhost:3000/src/uploads/ratinho.jpg',
    })
    recipeId = _id;
  });
  after(() => {
    MongoClient.connect.restore();
  });
  describe('Verifica se retorna uma imagem', () => {
    let response;
    let token;
    before(async () => {
      response = await chai.request(server)
        .get(`/images/ratinho.jpg`)
    });
    it('Verifica status codes do retorno é 200', () => {
      expect(response).to.have.status(StatusCodes.NOT_FOUND);
    })
  });
})