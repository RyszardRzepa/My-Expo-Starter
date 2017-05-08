import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import Details from '../components/Details';

class ReviewScreen extends Component {
  static navigationOptions = {
    title: 'Details',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="favorite" size={30} color={tintColor}/>;
    }
  };
  
  render () {
    return (
      <Details
        data={this.props.navigation.state}
      />
    )
  }
}

export default connect(null)(ReviewScreen);
