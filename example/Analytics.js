import { addEventListener } from '../src';
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