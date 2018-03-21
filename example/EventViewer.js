import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addEventListener } from 'react-redux-events';
import { TRACKING_EVENT, VIEWER_EVENT } from './Events';


const mapProps =  state => ({});
const mapDispatch = dispatch => ({
  addEventListener: (event, handler, priority) => dispatch(addEventListener(event, handler, priority))
});

class EventViewer extends Component {
  constructor(props) {
    super(props)
    this.props.addEventListener(TRACKING_EVENT, this.onEvent.bind(this));
    this.props.addEventListener(VIEWER_EVENT, this.onEvent.bind(this));
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