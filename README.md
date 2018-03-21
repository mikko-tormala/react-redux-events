React-Redux Events
==================

React-Redux Events implements the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) for use in React-Redux applications, enabling Event Dispatchers/Listeners between components.

```js
npm install --save react-redux-events
```

## Why Do I Need This?

If you’re not sure whether you need it, you probably don’t.

## Motivation

React-Redux Events (RRE) allows React-Redux application components to subscribe/dispatch to events. This is useful when you want to pass messages between components, but don't need to store the change in the state of the application.

### Use Cases

Any situation where one-to-many event dispatching without storing it in state is useful. For example:
- Using a centralized tracking module, and dispatching tracking events from components.
- Using a centralized data fetching/sending module.

## Principle

React-Redux Events (RRE) implements the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern).

In this implementation, `Listeners` subscribe to `Events`, which can be `Dispatched` from anywhere in the application.

Flow:
- Component signals interest in a specific `Event Type`, by registering a `Listener` method for that event.
- React-Redux Events stores the interest for that Event type.
- Sometime later, somewhere else in the application, an Event of that type is `Dispatched`.
- RRE looks up all the stored interested listeners for that event type, and calls the listener method with the event data.

## Requirements
- redux@>=3.1.0
- react@>16.0.0

## Installation

```
npm install --save react-redux-events
```

Then to enable React-Redux Events, register the RRE reducer along with your other reducers, and make sure you have the react-redux Provide wrapping your app:

```js
// Index.js
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reactReduxEventReducer } from 'react-redux-events';

// Example: The Button Component dispatches events
import Button from './Button';
// Example: The EventViewer Component listens for events and prints them
import EventViewer from './EventViewer';
// Example: Initialize Analytics non-react class (see below)
import Analytics from './Analytics';

// Add the reactReduxEventReducer reducer
const store = createStore(
  combineReducers({ ...reducers, reactReduxEvents: reactReduxEventReducer });
);

new Analytics(store);

ReactDOM.render(
  <Provider store={store}>
    <Button />
    <EventViewer />
  </Provider>,
  document.getElementById('root'));
```

That's it. Now you can use the react-redux `connect` method to tie add/remove listener actions to your components:

```js
// EventViewer.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addEventListener } from '../react-redux-events';
import { TRACKING_EVENT } from './Analytics';

const mapProps =  state => ({});
const mapDispatch = dispatch => ({
  addEventListener: (event, handler, priority) => dispatch(addEventListener(event, handler, priority))
});

class EventViewer extends Component {
  constructor(props) {
    super(props)
    this.props.addEventListener(TRACKING_EVENT, this.onEvent.bind(this));
    this.state = {
      events: []
    }
  }

  onEvent(event) {
    this.state.events.push(event);
  }

  render() {
    return (
      <ul>
        {this.state.events.map((event,i) => <li>{event.payload.time}: {event.payload.action}</li>)}
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
import { ReduxEvent, dispatchEvent } from '../react-redux-events';
import { TRACKING_EVENT } from './Analytics';

const mapProps =  state => ({});
const mapDispatch = dispatch => ({
  dispatchEvent: (event) => dispatch(dispatchEvent(event))
});

class Button extends Component {
  dispatchEvent() {
    // Create a new ReduxEvent and set the optional payload object
    let event = new ReduxEvent(TRACKING_EVENT, { action: 'click' });
    // Dispatch the event to listeners around the app
    this.props.dispatchEvent(event);
  }

  render() {
    return (
      <button onClick={this.dispatchEvent.bind(this)}>Dispatch Event!</button>
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
import { addEventListener } from '../react-redux-events';
import { TRACKING_EVENT } from './Analytics';

export const TRACKING_EVENT = 'TRACKING_EVENT';

export default class Analytics {
  constructor(store) {
    // We need a reference to the store to dispatch addEventListener methods
    this.store = store;
    this.registerListeners();
  }

  registerListeners() {
    this.store.dispatch(addEventListener(TRACKING_EVENT, onEvent.bind(this)));
  }

  onEvent(event) {
    console.log('Received event:');
    console.log(event);
  }
}
```

## License

MIT