const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const server = require('../../api/app');
const fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const MongoClientMock = require('../connectionMock');
const path = require('path');

chai.use(chaiHttp);
const { expect } = chai;

describe('PUT /recipes/:id/image/', () => {
  let receita;
  let token;
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
  after(() => {
    MongoClient.connect.restore();
  });
  describe('Verifica se adiciona imagem com sucesso', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post(`/recipes/${receita.body.recipe._id}/image`)
        .set('content-type', 'multipart/form-data')
        .set('authorization', token.body.token)
        .attach('image', path.join(__dirname, '..', '..', 'uploads', 'ratinho.jpg'))
    })
    it('Verifica se o status code recebi é 404', () => {
      console.log(response.body);
      expect(response).to.have.status(StatusCodes.NOT_FOUND);
    })
  })
});