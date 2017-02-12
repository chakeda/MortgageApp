/**
 * Response model events
 */

'use strict';

import {EventEmitter} from 'events';
import Response from './response.model';
var ResponseEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ResponseEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Response.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ResponseEvents.emit(event + ':' + doc._id, doc);
    ResponseEvents.emit(event, doc);
  };
}

export default ResponseEvents;
