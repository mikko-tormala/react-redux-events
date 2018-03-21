React-Redux Events
==================

Implements the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) for use in Redux applications, enabling Event Dispatchers/Listeners between any classes connected to the store. 

**Note: While the name "React" is part of the name, React is not required to use this package and it will work with any Redux application.**

```js
npm install --save react-redux-events
```

## Motivation

React-Redux Events (RRE) allows parts of an application using Redux to subscribe/dispatch to events. This is useful when you want to pass messages between parts of the application in a decoupled one-to-many manner, but don't need to store the change in the state of the application.

### Use Cases

Any situation where decoupled one-to-many event dispatching without storing it in state is useful. For example:
- Using a centralized tracking module, and dispatching tracking events from components.
- Using a centralized data fetching/sending module.

## Principle

React-Redux Events (RRE) implements the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern).

In this implementation, `Listeners` subscribe to `Events`, which can be `Dispatched` from anywhere in the application.

Base Flow:
- A component signals interest in a specific `Event Type`, by registering a `Listener` method for that event.
- React-Redux Events stores the interest for that Event type.
- Sometime later, somewhere else in the application, an Event of that type is `Dispatched`.
- RRE looks up all the stored interested listeners for that event type, and calls the listener method with the event data.
- When the component unmounts or is no longer interested in the event type, it signals RRE to remove the listener.

## Requirements
- redux@>=3.1.0
- react@>=16.0.0 (if you want to use with React)

## Usage with React

```
npm install --save react-redux-events
```

First, let's define some Event Types:

```js
// Events.js
export const VIEWER_EVENT = 'VIEWER_EVENT';
export const TRACKING_EVENT = 'TRACKING_EVENT';
```

Then to enable React-Redux Events, register the RRE reducer along with your other reducers, and make sure the react-redux Provider wraps your app:

```js
// Index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reduxEventReducer } from 'react-redux-events';

// Example: The Button Component dispatches events
import Button from './Button';
// Example: The EventViewer Component listens for events and prints them
import EventViewer from './EventViewer';
// Example: Initialize Analytics non-react class (see below)
import Analytics from './Analytics';

// Add the reactReduxEventReducer reducer
const store = createStore(
  combineReducers({ reactReduxEvents: reduxEventReducer })
);

new Analytics(store);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Button />
      <EventViewer />
    </div>
  </Provider>,
  document.body);
```

That's it. Now you can use the react-redux `connect` method to tie add/remove listener actions to your components:

```js
// EventViewer.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addEventListener } from 'react-redux-events';
import { TRACKING_EVENT, VIEWER_EVENT } from './Events';

const mapProps =  state => ({});
const mapDispatch = dispatch => ({
  addEventListener: (event, context, handler, priority) => dispatch(addEventListener(event, context, handler, priority))
});

class EventViewer extends Component {
  constructor(props) {
    super(props)
    this.props.addEventListener(TRACKING_EVENT, this, this.onEvent);
    this.props.addEventListener(VIEWER_EVENT, this, this.onEvent);
    this.eventList = []
  }

  onEvent(event) {
    this.eventList.push(event);
    this.forceUpdate();
  }

  render() {
    return (
      <ul>
        {this.eventList.map((event,i) => <li key={i}>{event.payload.date}: {event.type}</li>)}
      </ul>
    );
  }
}

const connectedEventViewer = connect(mapProps, mapDispatch)(EventViewer)
export default connectedEventViewer;
```

Likewise, you use the react-redux `connect` method to enable dispatching events:

```js
// Button.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { ReduxEvent, dispatchEvent } from 'react-redux-events';
import { TRACKING_EVENT, VIEWER_EVENT } from './Events';

const mapProps =  state => ({});
const mapDispatch = dispatch => ({
  dispatchEvent: (event) => dispatch(dispatchEvent(event))
});

class Button extends Component {
  dispatchEvent1() {
    // Create a new ReduxEvent and set the optional payload object
    let event = new ReduxEvent(TRACKING_EVENT, { date: Date.now() });
    // Dispatch the event to listeners around the app
    this.props.dispatchEvent(event);
  }
  
  dispatchEvent2() {
    let event = new ReduxEvent(VIEWER_EVENT, { date: Date.now() });
    this.props.dispatchEvent(event);
  }

  render() {
    return (
      <div>
        <button onClick={this.dispatchEvent1.bind(this)}>Dispatch Tracking Event!</button>
        <button onClick={this.dispatchEvent2.bind(this)}>Dispatch Viewer Event!</button>
      </div>
    );
  }
}

const connectedButton = connect(mapProps, mapDispatch)(Button)
export default connectedButton;
```

### Usage with non-react modules / classes
You can also add listeners / dispatchers to a non-react class:

```js
// Analytics.js
import { addEventListener } from 'react-redux-events';
import { TRACKING_EVENT } from './Events';

export default class Analytics {
  constructor(store) {
    // We need a reference to the store to dispatch addEventListener methods
    this.store = store;
    this.registerListeners();
  }

  registerListeners() {
    // Register the listener in the store
    this.store.dispatch(addEventListener(TRACKING_EVENT, this, this.onEvent));
  }

  onEvent(event) {
    console.log('Received event:', event.type, event.payload);
  }
}
```

## Removing listeners

When a component is unmounted or in general no longer wishes to receive events it has added listeners to, remember to `removeEventListener` each of those events. Otherwise you will have listeners firing on components that have already been removed from the app.

## API

These are the dispatchable methods available:

### `addEventListener(type, context, handler, [priority = 0])`
This method registers an event listener for the specific event `type` with the event `handler` method. 
The optional `priority` value sets the priority level. Event listeners with higher priority levels get handled before listeners with lower levels.

#### Arguments
- `type` (String) This is the type of the Event
- `context` (Object) This is the context where the handler will be called.
- `handler` (Method) This is the handler that is called when the event is triggered. The handler is passed an object with the following structure:
```js
{
  type: 'EVENT_TYPE', // String
  payload: {}, // Object
  priority: 0 // Int
}
```
- `[Optional] priority` (Integer) The priority handling level of this listener. A higher number is handled before lower numbers on the same event. Default value = 0.

#### Example
```js
registerListeners() {
  // Register the listener in the store
  this.store.dispatch(addEventListener('EVENT_TYPE', this.onEvent.bind(this)));
  this.store.dispatch(addEventListener('EVENT_TYPE', this.onPriorityEvent.bind(this), 2));
}

// Both of these listeners will be called when an event with the type 'EVENT_TYPE' is dispatched
onEvent(event) {
  console.log('Received event:');
  console.log('Event type:', event.type);
  console.log('Event payload:', event.payload);
  console.log('Event priority:', event.priority);
}

// Will be called first
onPriorityEvent(event) {
  console.log('Received priority event:');
  console.log('Priority Event type:', event.type);
  console.log('Priority Event payload:', event.payload);
  console.log('EPriority vent priority:', event.priority);
}
```

### `removeEventListener(type, context, handler)`
This method removes a event listener for the specific event `type` and the specified `handler` method.

#### Arguments
- `type` (String) This is the type of the Event that was registered
- `context` (Object) This is the context where the handler was registered.
- `handler` (Method) This is the handler that was registered

#### Example
```js
componentWillUnmount() {
  // Unregister the listener from the store
  this.store.dispatch(removeEventListener('EVENT_TYPE', this.onEvent.bind(this)));
}
```

### `dispatchEvent(type, [payload = {}], [priority = 0])`
This method dispatched an event. 
The optional `payload` value allows including a POJO (Plain Old Javascrip Object) payload that will be passed to the event handlers.
The optional `priority` value sets the priority level. Note! See below for details.

#### Arguments
- `type` (String) This is the type of the Event
- `[Optional] payload` (Object) A Plain Old Javascript Object that is passed to the event listeners as `event.payload`. Default value = `{}`.
- `[Optional] priority` (Integer) The priority handling level of this event. Default = 0 
  - **Note! If this value is set, only listeners with priority level matching or higher are called.**

#### Example
```js
onClick() {
  // Register the listener in the store
  this.store.dispatch(dispatchEvent('EVENT_TYPE'));
  this.store.dispatch(dispatchEvent('EVENT_TYPE', { data: 'something' }));
  this.store.dispatch(dispatchEvent('EVENT_TYPE', { data: 'something' }, 2));
}
```

### `removeAllListenersForContext(context)`
This method removes all event listeners for the specified `context`.

#### Arguments
- `context` (object) This is the context you want to remove listeners from

#### Example
```js
componentWillUnmount() {
  // Unregister the listener from the store
  this.store.dispatch(removeAllListenersForContext(this));
}
```

### `removeAllListenersForEvent(type)`
This method removes all event listener for the specified event `type`.

#### Arguments
- `type` (String) This is the type of the Event that was registered

#### Example
```js
componentWillUnmount() {
  // Unregister the listener from the store
  this.store.dispatch(removeAllListenersForEvent('EVENT_TYPE'));
}
```

### `setLogLevel(level)`
This method sets the console logging level for the event handling.

| Level | Details |
| --- | --- |
| 0 | No logging, except Errors. |
| 1 | Warnings and Errors |
| 2 | All |


#### Arguments
- `level` (Integer) This is the desired logging level. Default 0.

#### Example
```js
componentDidMount() {
  // Unregister the listener from the store
  this.store.dispatch(setLogLevel(2));
}
```
## License

MIT