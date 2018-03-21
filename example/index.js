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
  document.getElementById('root'));