import { REDUX_EVENT } from './constants';

export default class ReduxEvent {
  constructor(name, payload = {}, priority = 0) {
    this.__event_type = REDUX_EVENT;
    this.name = name;
    this.payload = payload;
    this.priority = priority;
  }
}
