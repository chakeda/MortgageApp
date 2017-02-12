'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var realtorCtrlStub = {
  index: 'realtorCtrl.index',
  show: 'realtorCtrl.show',
  create: 'realtorCtrl.create',
  upsert: 'realtorCtrl.upsert',
  patch: 'realtorCtrl.patch',
  destroy: 'realtorCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var realtorIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './realtor.controller': realtorCtrlStub
});

describe('Realtor API Router:', function() {
  it('should return an express router instance', function() {
    realtorIndex.should.equal(routerStub);
  });

  describe('GET /api/realtors', function() {
    it('should route to realtor.controller.index', function() {
      routerStub.get
        .withArgs('/', 'realtorCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/realtors/:id', function() {
    it('should route to realtor.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'realtorCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/realtors', function() {
    it('should route to realtor.controller.create', function() {
      routerStub.post
        .withArgs('/', 'realtorCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/realtors/:id', function() {
    it('should route to realtor.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'realtorCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/realtors/:id', function() {
    it('should route to realtor.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'realtorCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/realtors/:id', function() {
    it('should route to realtor.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'realtorCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
