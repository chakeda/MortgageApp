'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var loanofficerCtrlStub = {
  index: 'loanofficerCtrl.index',
  show: 'loanofficerCtrl.show',
  create: 'loanofficerCtrl.create',
  upsert: 'loanofficerCtrl.upsert',
  patch: 'loanofficerCtrl.patch',
  destroy: 'loanofficerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var loanofficerIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './loanofficer.controller': loanofficerCtrlStub
});

describe('Loanofficer API Router:', function() {
  it('should return an express router instance', function() {
    loanofficerIndex.should.equal(routerStub);
  });

  describe('GET /api/loanofficers', function() {
    it('should route to loanofficer.controller.index', function() {
      routerStub.get
        .withArgs('/', 'loanofficerCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/loanofficers/:id', function() {
    it('should route to loanofficer.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'loanofficerCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/loanofficers', function() {
    it('should route to loanofficer.controller.create', function() {
      routerStub.post
        .withArgs('/', 'loanofficerCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/loanofficers/:id', function() {
    it('should route to loanofficer.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'loanofficerCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/loanofficers/:id', function() {
    it('should route to loanofficer.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'loanofficerCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/loanofficers/:id', function() {
    it('should route to loanofficer.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'loanofficerCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
