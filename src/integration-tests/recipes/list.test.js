const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const server = require('../../api/app');
const { StatusCodes } = require('http-status-codes');
const MongoClientMock = require('../connectionMock');


chai.use(chaiHttp);
const { expect } = chai;

describe('GET /recipes', () => {
  before(async() => {
    const connectionMock = await MongoClientMock()
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    const db = await connectionMock.db('Cookmaster')
    const users = await db.collection('users');
    await users.deleteMany({});
    const recipes = await db.collection('recipes');
    await recipes.deleteMany({});
    await users.insertMany([
      {
        name: "banana caramelizada",
        ingredients: "banana, açúcar",
        preparation: "coloque o açúcar na frigideira até virar caramelo e jogue a banana"
      },
      {
        name: "Receita de frango do Jacquin",
        ingredients: "Frango",
        preparation: "10 min no forno",
        userId: "61aa4ef8a3036a53a1fbe888",
        image: "localhost:3000/src/uploads/61aa4ef8ebbbe5537a45fab1.jpeg"
      }
    ])
  });
  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Verifica se é listado todas as receitas', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .get('/recipes');
    });
    it('Retorna o código de status 200', () => {
      expect(response).to.have.status(StatusCodes.OK);
    });
    it('Retorna uma array, com duas receitas', () => {
      expect(response.body).to.be.a('array');
    });
  });
})