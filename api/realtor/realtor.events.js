/**
 * Realtor model events
 */

'use strict';

import {EventEmitter} from 'events';
import Realtor from './realtor.model';
var RealtorEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RealtorEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Realtor.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    RealtorEvents.emit(event + ':' + doc._id, doc);
    RealtorEvents.emit(event, doc);
  };
}

export default RealtorEvents;
