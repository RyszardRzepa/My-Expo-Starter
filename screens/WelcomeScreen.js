import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import { connect } from 'react-redux';

import { FetchCafes } from '../actions';
import Auth from '../components/Auth';

class WelcomeScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      token: null
    }
  }
  
  async componentWillMount () {
    let token = await AsyncStorage.getItem('token');
    
    if (token) {
      this.props.navigation.navigate('map');
      //this.setState({ token });
    } else {
      this.setState({ token: false });
    }
    
    this.props.FetchCafes();
  }
  
  render () {
    if (_.isNull(this.state.token)) {
      return <AppLoading />;
    }
    
    return (
      //TODO Reduce login/register screen to one file
      <Auth navigate={() => this.props.navigation.navigate('map')}/>
    );
  }
}

export default connect(null, { FetchCafes })(WelcomeScreen);