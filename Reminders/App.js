import React, { Component } from 'react';
import InitialScreen from './src/routes/router';
import { Provider } from 'react-redux';
import store from './src/redux/store/'

export default class App extends Component {
  // App name is reminder rocket
  render() {
    return (
      <Provider store={ store }>
        <InitialScreen/>
      </Provider>
    )
  }
}