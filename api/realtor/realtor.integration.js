'use strict';

var app = require('../..');
import request from 'supertest';

var newRealtor;

describe('Realtor API:', function() {
  describe('GET /api/realtors', function() {
    var realtors;

    beforeEach(function(done) {
      request(app)
        .get('/api/realtors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          realtors = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      realtors.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/realtors', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/realtors')
        .send({
          name: 'New Realtor',
          info: 'This is the brand new realtor!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newRealtor = res.body;
          done();
        });
    });

    it('should respond with the newly created realtor', function() {
      newRealtor.name.should.equal('New Realtor');
      newRealtor.info.should.equal('This is the brand new realtor!!!');
    });
  });

  describe('GET /api/realtors/:id', function() {
    var realtor;

    beforeEach(function(done) {
      request(app)
        .get(`/api/realtors/${newRealtor._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          realtor = res.body;
          done();
        });
    });

    afterEach(function() {
      realtor = {};
    });

    it('should respond with the requested realtor', function() {
      realtor.name.should.equal('New Realtor');
      realtor.info.should.equal('This is the brand new realtor!!!');
    });
  });

  describe('PUT /api/realtors/:id', function() {
    var updatedRealtor;

    beforeEach(function(done) {
      request(app)
        .put(`/api/realtors/${newRealtor._id}`)
        .send({
          name: 'Updated Realtor',
          info: 'This is the updated realtor!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedRealtor = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRealtor = {};
    });

    it('should respond with the original realtor', function() {
      updatedRealtor.name.should.equal('New Realtor');
      updatedRealtor.info.should.equal('This is the brand new realtor!!!');
    });

    it('should respond with the updated realtor on a subsequent GET', function(done) {
      request(app)
        .get(`/api/realtors/${newRealtor._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let realtor = res.body;

          realtor.name.should.equal('Updated Realtor');
          realtor.info.should.equal('This is the updated realtor!!!');

          done();
        });
    });
  });

  describe('PATCH /api/realtors/:id', function() {
    var patchedRealtor;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/realtors/${newRealtor._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Realtor' },
          { op: 'replace', path: '/info', value: 'This is the patched realtor!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedRealtor = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedRealtor = {};
    });

    it('should respond with the patched realtor', function() {
      patchedRealtor.name.should.equal('Patched Realtor');
      patchedRealtor.info.should.equal('This is the patched realtor!!!');
    });
  });

  describe('DELETE /api/realtors/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/realtors/${newRealtor._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when realtor does not exist', function(done) {
      request(app)
        .delete(`/api/realtors/${newRealtor._id}`)
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
