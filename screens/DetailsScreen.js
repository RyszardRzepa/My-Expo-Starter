import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import Cart from '../components/Cart';

class DetailsScreen extends Component {
  static navigationOptions = {
    title: 'Details',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="favorite" size={30} color={tintColor}/>;
    }
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

export default connect(null)(DetailsScreen);
