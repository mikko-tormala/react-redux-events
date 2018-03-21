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