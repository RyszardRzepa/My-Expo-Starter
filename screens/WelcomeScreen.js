import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Font } from 'expo';
import { connect } from 'react-redux';

import { FetchCafes } from '../actions';
import Auth from '../components/Auth';

class WelcomeScreen extends Component {
  static navigationOptions = {
   header:false,
  };
  
  componentDidMount() {
    Font.loadAsync({
      'lato-light': require('../assets/fonts/Lato-Light.ttf'),
      'lato-black': require('../assets/fonts/Lato-Black.ttf'),
    });
  }
  constructor (props) {
    super(props);
    this.state = {
      token: null
    }
  }
  
  async componentWillMount () {
    let token = await AsyncStorage.getItem('token');
    this.props.navigation.navigate('map');
    // if (token) {
    //   this.props.navigation.navigate('map');
    // } else {
    //   this.setState({ token: false });
    // }
  }
  
  componentWillUnmount() {
    this.setState({ token: null });
  }
  
  render () {
    return (
      //TODO Reduce login/register screen to one file
      <Auth navigate={() => this.props.navigation.navigate('map')}/>
    );
  }
}

export default connect(null, { FetchCafes })(WelcomeScreen);