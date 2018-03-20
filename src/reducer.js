import { ADD_EVENT_LISTENER, REMOVE_ALL_LISTENERS, REMOVE_EVENT_LISTENER, DISPATCH_EVENT, SET_LOGLEVEL } from "./constants";

const initialState = {
  eventListeners: new Map(),
  logLevel: 0
}

const reactReduxEventReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EVENT_LISTENER: return addEventListener(state, action);
    case DISPATCH_EVENT: return dispatchEvent(state, action);
    case REMOVE_EVENT_LISTENER: return removeEventListener(state, action);
    case REMOVE_ALL_LISTENERS: return removeAllListenersForEvent(state, action);
    case SET_LOGLEVEL: return setLogLevel(state, action);
    default: return state;
  }
};

function dispatchEvent(state, action) {
  let eventName = action.event.name;
  let payload = action.event.payload;
  let priority = action.event.priority;

  log(state.logLevel, 2, `Dispatch Event received. Name: [${eventName}], Priority: [${priority}]`);
  if (!state.eventListeners.has(eventName)) {
    log(state.logLevel, 1, `Warning: Dispatched event [${eventName}], but no listeners exist.`)
    return state;
  }
  let eventListeners = state.eventListeners.get(eventName);
  let listenersToHandle = [];
  
  // Create a list of all listeners that are eligeable to handle
  // the event based on their priority setting
  eventListeners.forEach(((value, event) => {
    if (event.priority >= priority) {
      listenersToHandle.push(event);
    }
  }))
  
  // Sort listeners by priority and handle in order
  if (listenersToHandle.length > 0) {
    listenersToHandle.sort((a,b)=>{
      let ap = a.priority;
      let bp = b.priority;
      return ap > bp ? -1 : ap < bp ? 1 : 0;
    })
    listenersToHandle.forEach((listener) => {
      listener.handler({
        type: eventName,
        priority: priority,
        payload: payload
      })
    })
  } else {
    log(state.logLevel, 1, `Warning: No handlers for [${eventName}] at or higher than priority level [${priority}]!`)
  }


  return state;
}

function addEventListener(state, action) {
  log(state.logLevel, 2, 'Add Event Listener:', action);
  let eventName = action.name;
  let eventHandler = action.handler;
  let priority = action.priority;

  if (typeof eventHandler !== 'function') {
    log(state.logLevel, 0, `Error: Tried to add a listener for event [${eventName}] but the provided handler is not a function!`)
    return state;
  }

  if (!state.eventListeners.has(eventName)) {
    state.eventListeners.set(eventName, new Map())
  }
  let eventListeners = state.eventListeners.get(eventName);

  eventListeners.forEach( (key, event) => {
    if (event.handler === eventHandler) {
      log(state.logLevel, 1, `Warning: Duplicate. Handler for event [${eventName}] already exists. Existing priority level: [${event.priority}]! Not adding a duplicate.`)
      return state;        
    }
  });

  eventListeners.set({
    priority: priority,
    handler: eventHandler
  });
  return state;
}

function removeEventListener(state, action) {
  log(state.logLevel, 2, 'Remove Event Listener', action);
  let eventName = action.name;
  let eventHandler = action.handler;
  if (!state.eventListeners.has(eventName)) {
    log(state.logLevel, 1, `Warning: Tried to remove a listener for event [${eventName}], but none exist.`)
    return state;
  }
  let eventListeners = state.eventListeners.get(eventName);

  let found = false;
  eventListeners.forEach( (key, event, map) => {
    if (event.handler === eventHandler) {
      map.delete(key);
      found = true;
    }
  });
  
  if (!found) {
    log(state.logLevel, 1, `Warning: Tried to remove a listener for event [${eventName}], but didn't find a listener that matches.`)
  }

  return state;
}

function removeAllListenersForEvent(state, action) {
  log(state.logLevel, 2, 'Remove Event Listener', action);
  let eventName = action.name;
  if (!state.eventListeners.has(eventName)) {
    log(state.logLevel, 1, `Warning: Tried to remove listeners for event [${eventName}], but none exist.`)
    return state;
  }
  state.eventListeners.delete(eventName);
  return state;
}

function setLogLevel(state, action) {
  log(state.logLevel, 2, 'setLogLevel', action);
  if (typeof action.level !== 'number') {
    log(state.logLevel, 0, `Error: Tried to set Logging Level, but value is not a number: [${action.level}]`);
    return state;
  }
  let newLevel = parseInt(action.level, 10);
  log(state.logLevel, 1, 'Changing loglevel to', newLevel);
  return Object.assign({}, state, {
    logLevel: newLevel
  });
}

function log(logLevel, targetLevel, msg, ...rest) {
  if (logLevel >= targetLevel) console.log('ReactReduxEventReducer >', msg, ...rest);
}

export default reactReduxEventReducer;
