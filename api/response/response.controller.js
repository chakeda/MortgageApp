/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/responses              ->  index
 * POST    /api/responses              ->  create
 * GET     /api/responses/:id          ->  show
 * PUT     /api/responses/:id          ->  upsert
 * PATCH   /api/responses/:id          ->  patch
 * DELETE  /api/responses/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Response from './response.model';

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

// Gets a list of Responses
export function index(req, res) {
  return Response.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Response from the DB
export function show(req, res) {
  return Response.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Response in the DB
export function create(req, res) {
  return Response.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Response in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Response.findOneAndUpdate(req.params.id, req.body, {upsert: true, setDefaultsOnInsert: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Response in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Response.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Response from the DB
export function destroy(req, res) {
  return Response.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
