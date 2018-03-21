import {
  ADD_EVENT_LISTENER,
  REMOVE_EVENT_LISTENER,
  DISPATCH_EVENT,
  SET_LOGLEVEL,
  REMOVE_ALL_LISTENERS_FOR_EVENT,
  REMOVE_ALL_LISTENERS_FOR_CONTEXT,
} from './constants';

export const dispatchEvent = (event) => ({
  type: DISPATCH_EVENT,
  event,
});

export const addEventListener = (name, context, handler, priority = 0) => ({
  type: ADD_EVENT_LISTENER,
  name,
  context,
  handler,
  priority,
});

export const removeEventListener = (name, context, handler) => ({
  type: REMOVE_EVENT_LISTENER,
  context,
  name,
  handler,
});

export const removeAllListenersForContext = (context) => ({
  type: REMOVE_ALL_LISTENERS_FOR_CONTEXT,
  context,
});

export const removeAllListenersForEvent = (name) => ({
  type: REMOVE_ALL_LISTENERS_FOR_EVENT,
  name,
});

export const setLogLevel = (level) => ({
  type: SET_LOGLEVEL,
  level,
});
