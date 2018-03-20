import {
  ADD_EVENT_LISTENER,
  REMOVE_EVENT_LISTENER,
  REMOVE_ALL_LISTENERS,
  DISPATCH_EVENT,
  SET_LOGLEVEL
} from './constants';

export const dispatchEvent = (event) => ({
  type: DISPATCH_EVENT,
  event
});

export const addEventListener = (name, handler, priority = 0) => ({
  type: ADD_EVENT_LISTENER,
  name,
  handler,
  priority
})

export const removeEventListener = (name, handler) => ({
  type: REMOVE_EVENT_LISTENER,
  name,
  handler
})

export const removeAllListenersForEvent = (name) => ({
  type: REMOVE_ALL_LISTENERS,
  name
})

export const setLogLevel = (level) => ({
  type: SET_LOGLEVEL,
  level
})