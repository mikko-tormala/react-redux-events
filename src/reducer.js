import {
  DISPATCH_EVENT,
  ADD_EVENT_LISTENER,
  REMOVE_EVENT_LISTENER,
  REMOVE_ALL_LISTENERS_FOR_EVENT,
  REMOVE_ALL_LISTENERS_FOR_CONTEXT,
  SET_LOGLEVEL,
} from './constants';

const initialState = {
  events: new Map(),
  logLevel: 0,
};

const reactReduxEventReducer = (state = initialState, action) => {
  switch (action.type) {
  case ADD_EVENT_LISTENER: return addEventListener(state, action);
  case DISPATCH_EVENT: return dispatchEvent(state, action);
  case REMOVE_EVENT_LISTENER: return removeEventListener(state, action);
  case REMOVE_ALL_LISTENERS_FOR_EVENT: return removeAllListenersForEvent(state, action);
  case REMOVE_ALL_LISTENERS_FOR_CONTEXT: return removeAllListenersForContext(state, action);
  case SET_LOGLEVEL: return setLogLevel(state, action);
  default: return state;
  }
};


function dispatchEvent(state, action) {
  const eventName = action.event.name;
  const payload = action.event.payload;
  const priority = action.event.priority;

  log(state.logLevel, 2, `Dispatch Event received. Name: [${eventName}], Priority: [${priority}]`);
  if (!state.events.has(eventName)) {
    log(state.logLevel, 1, `Warning: Dispatched event [${eventName}], but no listeners exist.`);
    return state;
  }
  const eventListeners = state.events.get(eventName);
  const listenersToHandle = [];

  // Create a list of all listeners that are eligeable to handle
  // the event based on their priority setting
  eventListeners.forEach((listeners) => {
    listeners.forEach((listenerData) => {
      if (listenerData.priority >= priority) {
        listenersToHandle.push(listenerData);
      }
    });
  });

  // Sort listeners by priority and handle in order
  if (listenersToHandle.length > 0) {
    listenersToHandle.sort((a, b)=>{
      const ap = a.priority;
      const bp = b.priority;
      return ap > bp ? -1 : (ap < bp ? 1 : 0);
    });
    listenersToHandle.forEach((listenerData) => {
      listenerData.handler.apply(listenerData.context, [{
        type: eventName,
        context: listenerData.context,
        priority: priority,
        payload: payload,
      }]);
    });
  } else {
    log(state.logLevel, 1, `Warning: No handlers for [${eventName}] at or higher than priority level [${priority}]!`);
  }

  return state;
}

function addEventListener(state, action) {
  log(state.logLevel, 2, 'Add Event Listener:', action);
  const eventName = action.name;
  const listenerContext = action.context;
  const listenerHandler = action.handler;
  const listenerPriority = action.priority;

  if (typeof listenerHandler !== 'function') {
    log(state.logLevel, 0, `Error: Tried to add a listener for event [${eventName}] but the provided handler is not a function!`);
    return state;
  }

  if (!state.events.has(eventName)) {
    state.events.set(eventName, new Map());
  }
  const eventListeners = state.events.get(eventName);

  if (!eventListeners.has(listenerContext)) {
    eventListeners.set(listenerContext, new Map());
  }
  const listenersInContext = eventListeners.get(listenerContext);

  listenersInContext.forEach( (key, listener) => {
    if (key === listenerHandler) {
      log(state.logLevel, 1, `Warning: Duplicate. Handler for event [${eventName}] already exists, set at priority level: [${listener.priority}]! Not adding a duplicate.`);
      return state;
    }
  });

  // Adding the listener
  listenersInContext.set(listenerHandler, {
    priority: listenerPriority,
    context: listenerContext,
    handler: listenerHandler,
  });

  return state;
}

function removeEventListener(state, action) {
  log(state.logLevel, 2, 'Remove Event Listener', action);
  const eventName = action.name;
  const listenerContext = action.context;
  const listenerHandler = action.handler;

  const events = state.events.get(eventName);
  if (events === undefined) {
    log(state.logLevel, 1, `Warning: Tried to remove a listener for event [${eventName}], but no listeners for that event exist.`);
    return state;
  }

  const listeners = events.get(listenerContext);
  if (listeners === undefined) {
    log(state.logLevel, 1, `Warning: Tried to remove a listener for event [${eventName}], but none exist.`);
    return state;
  }

  const found = listeners.delete(listenerHandler);
  if (!found) {
    log(state.logLevel, 1, `Warning: Tried to remove a listener for event [${eventName}], but didn't find a listener that matches.`);
  } else {
    // If no handlers exist for the context, delete the empty map.
    if (events.get(listenerContext).size === 0) {
      events.delete(listenerContext);
      if (state.events.get(eventName).size === 0) {
        state.events.delete(eventName);
      }
    }
  }

  return state;
}

function removeAllListenersForContext(state, action) {
  log(state.logLevel, 2, 'Remove Event Listeners For Context', action);
  const listenerContext = action.context;
  const events = state.events;
  let found = false;
  events.forEach((eventListeners, eventType, eventMap) => {
    if (eventListeners.delete(listenerContext)) {
      found = true;
      if (eventMap.size === 0) {
        eventMap.delete(eventType);
      }
    }
  });
  if (!found) {
    log(state.logLevel, 1, `Warning: Tried to remove listeners for context [${listenerContext}], but didn't find any.`);
  }

  return state;
}

function removeAllListenersForEvent(state, action) {
  log(state.logLevel, 2, 'Remove Event Listeners For Event', action);
  const eventName = action.name;
  if (!state.events.delete(eventName)) {
    log(state.logLevel, 1, `Warning: Tried to remove listeners for event [${eventName}], but none exist.`);
  }
  return state;
}

function setLogLevel(state, action) {
  log(state.logLevel, 2, 'setLogLevel', action);
  if (typeof action.level !== 'number') {
    log(state.logLevel, 0, `Error: Tried to set Logging Level, but value is not a number: [${action.level}]`);
    return state;
  }
  const newLevel = parseInt(action.level, 10);
  log(state.logLevel, 1, 'Changing loglevel to', newLevel);
  return Object.assign({}, state, {
    logLevel: newLevel,
  });
}

function log(logLevel, targetLevel, msg, ...rest) {
  if (logLevel >= targetLevel) console.log('ReactReduxEventReducer >', msg, ...rest);
}

export default reactReduxEventReducer;
