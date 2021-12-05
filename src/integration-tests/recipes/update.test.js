const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const server = require('../../api/app');
const { StatusCodes } = require('http-status-codes');
const MongoClientMock = require('../connectionMock');


chai.use(chaiHttp);
const { expect } = chai;

describe('PUT /recipes/:id', () => {
  let receita = {};
  let token = '';
  before(async () => {
    const connectionMock = await MongoClientMock()
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    const db = await connectionMock.db('Cookmaster')
    const users = await db.collection('users');
    await users.deleteMany({});
    const recipes = await db.collection('recipes');
    await recipes.deleteMany({});
    user = await chai.request(server)
      .post('/users')
      .send({
          name: "string",
          email: "lucas@hotmail.com",
          password: "string"
        });
    token = await chai.request(server)
    .post('/login')
    .send({
        email: 'lucas@hotmail.com',
        password: 'string'
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
  describe('Verifica se retorna um erro ao tentar editar uma receita sem estar autenticado', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .put(`/recipes/${receita.body.recipe._id}`)
        .send({
          name: "batata frita",
          ingredients: "óleo, batata",
          preparation: "frita tudo no óleo e boa"
        });
    });
    it('Verifica se código de status é 401', () => {
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it('Verifica a mensagem de erro', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('missing auth token');
    })
  });
  describe('Verifica se retorna um erro ao tentar editar uma receita com token inválido', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .put(`/recipes/${receita.body.recipe._id}`)
        .send({
          name: "batata frita",
          ingredients: "óleo, batata",
          preparation: "frita tudo no óleo e boa"
        })
        .set('authorization', 'asd');
    });
    it('Verifica se código de status é 401', () => {
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it('Verifica a mensagem de erro', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('jwt malformed');
    })
  });
  describe('Verifica se edita a receita com sucesso', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .put(`/recipes/${receita.body.recipe._id}`)
        .send({
          name: "batata frita",
          ingredients: "óleo, batata",
          preparation: "frita tudo no óleo e boa"
        })
        .set('authorization', token.body.token);
    });
    it('Verifica se código de status é 200', () => {
      expect(response).to.have.status(StatusCodes.OK);
    });
    it('Verifica se a receita é editada com sucesso', () => {
      expect(response.body).to.have.all.deep.keys('name', '_id', 'ingredients', 'preparation', 'userId');
    })
  });
})