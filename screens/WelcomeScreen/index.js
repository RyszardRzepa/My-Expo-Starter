import React, { Component } from 'react';
import { AsyncStorage, StatusBar, View, Platform } from 'react-native';
import { Font } from 'expo';
import { connect } from 'react-redux';

import { FetchCafes } from '../../actions';
import Auth from '../../components/Auth';

class WelcomeScreen extends Component {
  static navigationOptions = {
    header: false,
  };
  
  componentDidMount () {
    Font.loadAsync({
      'lato-light': require('../../assets/fonts/Lato-Light.ttf'),
      'lato-black': require('../../assets/fonts/Lato-Black.ttf'),
      'raleway-light': require('../../assets/fonts/Raleway-Light.ttf'),
      'raleway-medium': require('../../assets/fonts/Raleway-Medium.ttf'),
      'raleway-semibold': require('../../assets/fonts/Raleway-SemiBold.ttf'),
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
    
    if (token) {
      this.props.navigation.navigate('map');
    } else {
      this.setState({ token: false });
    }
  }
  
  componentWillUnmount () {
    this.setState({ token: null });
  }
  
  render () {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          hidden={Platform.OS === 'android'}
        />
        <Auth navigate={() => this.props.navigation.navigate('map')}/>
      </View>
    );
  }
}

export default connect(null, { FetchCafes })(WelcomeScreen);