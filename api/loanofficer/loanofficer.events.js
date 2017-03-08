/**
 * Loanofficer model events
 */

'use strict';

import {EventEmitter} from 'events';
import Loanofficer from './loanofficer.model';
var LoanofficerEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LoanofficerEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Loanofficer.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    LoanofficerEvents.emit(event + ':' + doc._id, doc);
    LoanofficerEvents.emit(event, doc);
  };
}

export default LoanofficerEvents;
