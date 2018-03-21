import React, { Component } from 'react';
import { connect } from 'react-redux'
import { ReduxEvent, dispatchEvent } from 'react-redux-events';
import { TRACKING_EVENT, CLICK_EVENT } from './Events';

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
    let event = new ReduxEvent(CLICK_EVENT, { date: Date.now() });
    this.props.dispatchEvent(event);
  }

  render() {
    return (
      <div>
        <button onClick={this.dispatchEvent1.bind(this)}>Dispatch Tracking Event!</button>
        <button onClick={this.dispatchEvent2.bind(this)}>Dispatch Click Event!</button>
      </div>
    );
  }
}

const connectedButton = connect(mapProps, mapDispatch)(Button)
export default connectedButton;