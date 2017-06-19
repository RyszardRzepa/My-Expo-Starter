import React, { Component } from 'react';
import  { View, Dimensions, Button } from 'react-native';
import { connect } from 'react-redux';

import { clearCart, cashierConfirmOrder } from '../../actions';
import Receipt from "../../components/Receipt";

const { width, height } = Dimensions.get('window');

class ReceiptScreen extends Component {
  static navigationOptions = {
    header: false,
    tabBarVisible: false,
    gesturesEnabled: false
  };
  
  confirmReceipt = async (order, total) => {
    await  this.props.cashierConfirmOrder(order, total);
    await this.props.clearCart();
    this.props.navigation.navigate('details', this.props.cafeDetails);
  };
  
  render () {
    const { address, name, takeAway, total } = this.props.navigation.state.params;
    const { totalCartPrice, cart } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Receipt
          title='Your Order Receipt'
          cafeName={name}
          takeAway={takeAway}
          total={total}
          address={address}
          totalCartPrice={totalCartPrice}
          cart={cart}
        />
        <View style={{ height: height * 0.08, backgroundColor: '#51ade8', justifyContent: 'center' }}>
          <Button
            color='#fff'
            title="OK"
            onPress={() => this.confirmReceipt({ address, name, takeAway, total, cart }, total)}
          />
        </View>
      </View>
    )
  }
}

mapStateToProps = ({ cart, cafes }) => {
  return {
    cart: cart.cartItems,
    totalCartItems: cart.totalCartItems,
    totalCartPrice: cart.totalCartPrice,
    cafeDetails: cafes.cafeDetails
  }
};

export default connect(mapStateToProps, { cashierConfirmOrder, clearCart })(ReceiptScreen);