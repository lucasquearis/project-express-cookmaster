const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../../api/app');
const { StatusCodes } = require('http-status-codes');
const MongoClientMock = require('../connectionMock');

chai.use(chaiHttp);
const { expect } = chai;

describe('DELETE /recipes/:id', () => {
  let token;
  let receita;
  before(async () => {
    const connectionMock = await MongoClientMock()
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    const db = await connectionMock.db('Cookmaster')
    const users = await db.collection('users');
    await users.deleteMany({});
    const recipes = await db.collection('recipes');
    await recipes.deleteMany({});
    await chai.request(server)
    .post('/users')
    .send({
        name: "luiz",
        email: "luiz@hotmail.com",
        password: '12345',
      });
    token = await chai.request(server)
    .post('/login')
    .send({
        email: 'luiz@hotmail.com',
        password: '12345',
      });
    receita = await chai.request(server)
    .post('/recipes')
    .send({
        name: "frango",
        ingredients: "frango, batata",
        preparation: "frita tudo e boa"
      })
      .set('authorization', token.body.token);
  });
  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Verifica se retorna um erro ao tentar deletar uma receita sem autenticação', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .delete(`/recipes/${receita.body.recipe._id}`);
    });
    it('Verifica se o código de status recebido é 401', () => {
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it('Verifica a mensagem de erro recebida', () => {
      expect(response.body).to.be.a('object');
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });
  describe('Verifica se deleta uma receita com sucesso', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
      .delete(`/recipes/${receita.body.recipe._id}`)
      .set('authorization', token.body.token);
    })
    it('Verifica se o código de status recebido é 204', () => {
      expect(response).to.have.status(StatusCodes.NO_CONTENT)
    })
  })
})
