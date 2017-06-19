import React, { Component, PropTypes } from 'react';
import  { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
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
        <View
          style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => this.confirmReceipt({ address, name, takeAway, total, cart }, total)}>
            <Text style={{ fontSize: 20, color: '#fff' }}> OK </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

ReceiptScreenPropTypes = {
  cart: PropTypes.array,
  totalCartPrice: PropTypes.num,
  totalCartItems: PropTypes.num,
  cafeDetails: PropTypes.object
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