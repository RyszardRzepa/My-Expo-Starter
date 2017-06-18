import React, { Component } from 'react';
import { View, Text } from 'react-native';

class OrderHistoryDetail extends Component {
  static navigationOptions = {
    title: 'Order History',
  };
  render () {
    console.log("details order history", this.props);
    return (
      <View>
        <Text>
          Order History detail
        </Text>
      </View>
    )
  }
}

export default OrderHistoryDetail;