import React, { Component } from 'react';
import { connect } from 'react-redux'
import { removeEventListener, removeAllListenersForEvent, addEventListener } from 'react-redux-events';
import { TRACKING_EVENT, CLICK_EVENT } from './Events';
import { removeAllListenersForContext } from '../src/actions';


const mapProps =  state => ({});
const mapDispatch = dispatch => ({
  addEventListener: (event, context, handler, priority) => dispatch(addEventListener(event, context, handler, priority)),
  removeEventListener: (event, context, handler) => dispatch(removeEventListener(event, context, handler)),
  removeAllListenersForEvent: (event) => dispatch(removeAllListenersForEvent(event)),
  removeAllListenersForContext: (context) => dispatch(removeAllListenersForContext(context))
});

class EventViewer extends Component {
  constructor(props) {
    super(props)
    this.eventList = [];
    this.state = {
      trackingListener: false,
      clickListener: false,
    }
  }

  onEvent(event) {
    this.eventList.push(event);
    this.forceUpdate();
  }

  toggleClickListener() {
    this.setState({ clickListener: !this.state.clickListener}, () => {
      this.addRemoveListener(CLICK_EVENT, this.state.clickListener);
    });
  }

  toggleTrackingListener() {
    this.setState({ trackingListener: !this.state.trackingListener}, () => {
      this.addRemoveListener(TRACKING_EVENT, this.state.trackingListener);
    });
  }

  addRemoveListener(name, listen) {
    if (listen) {
      this.props.addEventListener(name, this, this.onEvent);
    } else {
      this.props.removeEventListener(name, this, this.onEvent);
    }
  }

  render() {
    return (
      <ul>
        <button onClick={this.toggleClickListener.bind(this)}>{this.state.clickListener ? 'Remove' : 'Add'} Listener for the click event.</button>
        <button onClick={this.toggleTrackingListener.bind(this)}>{this.state.trackingListener ? 'Remove' : 'Add'} Listener for the tracking event.</button>
        {this.eventList.map((event,i) => <li key={i}>{event.payload.date}: {event.type}</li>)}
      </ul>
    );
  }
}

const connectedEventViewer = connect(mapProps, mapDispatch)(EventViewer)
export default connectedEventViewer;