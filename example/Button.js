// Button.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { ReduxEvent, dispatchEvent } from '../src';
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