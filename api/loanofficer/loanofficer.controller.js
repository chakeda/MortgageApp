/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/loanofficers              ->  index
 * POST    /api/loanofficers              ->  create
 * GET     /api/loanofficers/:id          ->  show
 * PUT     /api/loanofficers/:id          ->  upsert
 * PATCH   /api/loanofficers/:id          ->  patch
 * DELETE  /api/loanofficers/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Loanofficer from './loanofficer.model';

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

// Gets a list of Loanofficers
export function index(req, res) {
  return Loanofficer.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Loanofficer from the DB
export function show(req, res) {
  return Loanofficer.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Loanofficer in the DB
export function create(req, res) {
  return Loanofficer.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Loanofficer in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Loanofficer.findOneAndUpdate(req.params.id, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Loanofficer in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Loanofficer.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Loanofficer from the DB
export function destroy(req, res) {
  return Loanofficer.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
