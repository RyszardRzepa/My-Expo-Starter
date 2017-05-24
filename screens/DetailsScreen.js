import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

import { FetchUserData } from '../actions'
import Cart from '../components/Cart';

class DetailsScreen extends Component {
  componentWillMount () {
    this.props.FetchUserData()
  }
  
  static navigationOptions = {
    title: 'Cafe Details',
    headerRight: (<Text>0</Text>),
    headerTitleStyle: { alignSelf: 'center'}
  };
  
  navigateCallback = (route, prop) => {
    this.props.navigation.navigate(route, prop)
  };
  
  render () {
    return (
      <Cart
        data={this.props.navigation.state.params}
        navigation={this.navigateCallback}
      />
    )
  }
}

DetailsScreen.defaultProps = {
  userData: {
    credits: 0
  }
};

mapStateToProps = ({ auth }) => {
  return {
    userData: auth.userData
  }
};

export default connect(mapStateToProps, { FetchUserData })(DetailsScreen);
