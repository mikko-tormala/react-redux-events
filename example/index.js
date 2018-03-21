// Index.js
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reactReduxEventReducer } from '../src';

// Example: The Button Component dispatches events
import Button from './Button';
// Example: The EventViewer Component listens for events and prints them
import EventViewer from './EventViewer';
// Example: Initialize Analytics non-react class (see below)
import Analytics from './Analytics';

// Add the reactReduxEventReducer reducer
const store = createStore(
  combineReducers({ ...reducers, reactReduxEvents: reactReduxEventReducer })
);

new Analytics(store);

ReactDOM.render(
  <Provider store={store}>
    <Button />
    <EventViewer />
  </Provider>,
  document.getElementById('root'));