import React, { Component } from 'react';
import Receipt from '../../components/Receipt';

class OrderHistoryDetail extends Component {
  static navigationOptions = {
    title: 'Order Receipt',
  };
  
  render () {
    const { address, name, takeAway, total, cart } = this.props.navigation.state.params.order;
    return (
      <Receipt
        title='Your Order Receipt'
        cafeName={name}
        takeAway={takeAway}
        address={address}
        totalCartPrice={total}
        cart={cart}
      />
    )
  }
}

export default OrderHistoryDetail;