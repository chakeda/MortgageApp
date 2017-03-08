'use strict';

var app = require('../..');
import request from 'supertest';

var newLoanofficer;

describe('Loanofficer API:', function() {
  describe('GET /api/loanofficers', function() {
    var loanofficers;

    beforeEach(function(done) {
      request(app)
        .get('/api/loanofficers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          loanofficers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      loanofficers.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/loanofficers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/loanofficers')
        .send({
          name: 'New Loanofficer',
          info: 'This is the brand new loanofficer!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newLoanofficer = res.body;
          done();
        });
    });

    it('should respond with the newly created loanofficer', function() {
      newLoanofficer.name.should.equal('New Loanofficer');
      newLoanofficer.info.should.equal('This is the brand new loanofficer!!!');
    });
  });

  describe('GET /api/loanofficers/:id', function() {
    var loanofficer;

    beforeEach(function(done) {
      request(app)
        .get(`/api/loanofficers/${newLoanofficer._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          loanofficer = res.body;
          done();
        });
    });

    afterEach(function() {
      loanofficer = {};
    });

    it('should respond with the requested loanofficer', function() {
      loanofficer.name.should.equal('New Loanofficer');
      loanofficer.info.should.equal('This is the brand new loanofficer!!!');
    });
  });

  describe('PUT /api/loanofficers/:id', function() {
    var updatedLoanofficer;

    beforeEach(function(done) {
      request(app)
        .put(`/api/loanofficers/${newLoanofficer._id}`)
        .send({
          name: 'Updated Loanofficer',
          info: 'This is the updated loanofficer!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedLoanofficer = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLoanofficer = {};
    });

    it('should respond with the original loanofficer', function() {
      updatedLoanofficer.name.should.equal('New Loanofficer');
      updatedLoanofficer.info.should.equal('This is the brand new loanofficer!!!');
    });

    it('should respond with the updated loanofficer on a subsequent GET', function(done) {
      request(app)
        .get(`/api/loanofficers/${newLoanofficer._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let loanofficer = res.body;

          loanofficer.name.should.equal('Updated Loanofficer');
          loanofficer.info.should.equal('This is the updated loanofficer!!!');

          done();
        });
    });
  });

  describe('PATCH /api/loanofficers/:id', function() {
    var patchedLoanofficer;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/loanofficers/${newLoanofficer._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Loanofficer' },
          { op: 'replace', path: '/info', value: 'This is the patched loanofficer!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedLoanofficer = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedLoanofficer = {};
    });

    it('should respond with the patched loanofficer', function() {
      patchedLoanofficer.name.should.equal('Patched Loanofficer');
      patchedLoanofficer.info.should.equal('This is the patched loanofficer!!!');
    });
  });

  describe('DELETE /api/loanofficers/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/loanofficers/${newLoanofficer._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when loanofficer does not exist', function(done) {
      request(app)
        .delete(`/api/loanofficers/${newLoanofficer._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
