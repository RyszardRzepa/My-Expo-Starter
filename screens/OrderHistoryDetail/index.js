import React, { Component } from 'react';
import { View, Text } from 'react-native';

import Receipt from '../../components/Receipt';

class OrderHistoryDetail extends Component {
  static navigationOptions = {
    title: 'Order Receipt',
  };
  
  render () {
    const { address, name, takeAway, total, cart } = this.props.navigation.state.params.order;
    return (
      <View style={{ flex :1 }}>
        <View style={{ height: 10, backgroundColor: '#fff' }}/>
        <Receipt
          title='Your Order Receipt'
          cafeName={name}
          takeAway={takeAway}
          address={address}
          totalCartPrice={total}
          cart={cart}
          date={this.props.navigation.state.params.date}
        />
        <Text> Receipt nr. 3232</Text>
      </View>
    )
  }
}

export default OrderHistoryDetail;