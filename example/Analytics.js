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