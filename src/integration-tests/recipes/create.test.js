const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const server = require('../../api/app');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const MongoClientMock = require('../connectionMock');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /recipes', () => {
  before(async() => {
    const connectionMock = await MongoClientMock()
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    const db = await connectionMock.db('Cookmaster')
    const users = await db.collection('users');
    await users.deleteMany({});
    const recipes = await db.collection('recipes');
    await recipes.deleteMany({});
    // https://stackoverflow.com/questions/48861967/writing-unit-tests-for-method-that-uses-jwt-token-in-javascript
    sinon.stub(jwt, 'verify')
    .onCall(0).throws({
      name: 'JsonWebTokenError',
      message: 'jwt malformed'
    })
    .onCall(1).resolves().callsFake(() => {
      return Promise.resolve({success: 'Token is valid'});
  });
  });
  after(async () => {
    MongoClient.connect.restore();
    jwt.verify.restore();
  });
  describe('Quando não é inserido o campo "name" é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/recipes')
        .send({
            ingredients: "frango, batata",
            preparation: "frita tudo e boa"
          });
    })
    it('Retorna o código de status 400', () => {
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Invalid entries. Try again.");
    });
  });
  describe('Quando não é inserido o campo "ingredients" é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/recipes')
        .send({
            name: "frango",
            preparation: "frita tudo e boa"
          });
    })
    it('Retorna o código de status 400', () => {
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Invalid entries. Try again.");
    });
  });
  describe('Quando não é inserido o campo "preparation" é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/recipes')
        .send({
            name: "frango",
            ingredients: "frango, batata"
          });
    })
    it('Retorna o código de status 400', () => {
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Invalid entries. Try again.");
    });
  });
  describe('Quando é inserido o campo "token" inválido é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/recipes')
        .send({
            name: "frango",
            ingredients: "frango, batata",
            preparation: "frita tudo e boa"
          })
          .set('authorization', 'asq');
    })
    it('Retorna o código de status 401', () => {
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("jwt malformed");
    });
  });
  describe('Quando a receita é criada com sucesso', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/recipes')
        .send({
            name: "frango",
            ingredients: "frango, batata",
            preparation: "frita tudo e boa"
          })
          .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWFhNGVmOGEzMDM2YTUzYTFmYmU4ODciLCJlbWFpbCI6InJvb3RAZW1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM4NTU3NTI5LCJleHAiOjE2Mzg1NjExMjl9.IHHUyDTm0wK3fEpEhuLrBiQRCYU0-8QgA-H7mzSYcQI');
    })
    it('Retorna o código de status 201', () => {
      expect(response).to.have.status(StatusCodes.CREATED);
    });
    it('Retorna um objeto recipe', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('recipe')
    });
    it('Retorna receita com todos os dados' , () => {
      const { body: { recipe } } = response;
      expect(recipe).to.have.all.deep.keys('name', 'ingredients', 'preparation', '_id')
    });
  });
})