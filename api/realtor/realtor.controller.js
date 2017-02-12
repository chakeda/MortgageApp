/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/realtors              ->  index
 * POST    /api/realtors              ->  create
 * GET     /api/realtors/:id          ->  show
 * PUT     /api/realtors/:id          ->  upsert
 * PATCH   /api/realtors/:id          ->  patch
 * DELETE  /api/realtors/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Realtor from './realtor.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Realtors
export function index(req, res) {
  return Realtor.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Realtor from the DB
export function show(req, res) {
  return Realtor.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Realtor in the DB
export function create(req, res) {
  return Realtor.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Realtor in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Realtor.findOneAndUpdate(req.params.id, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Realtor in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Realtor.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Realtor from the DB
export function destroy(req, res) {
  return Realtor.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
