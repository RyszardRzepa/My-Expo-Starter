import React, { Component } from 'react';
import  { View, Text, Dimensions } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { connect } from 'react-redux';

import { clearCart, cashierConfirmOrder } from '../../actions';
import OrderView from '../../components/OrderView';
import styles from './styles';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

class ReceiptScreen extends Component {
  static navigationOptions = {
    header: false,
    tabBarVisible: false,
  };
  
  confirmReceipt = async (order, total) => {
    await  this.props.cashierConfirmOrder(order, total);
    await this.props.clearCart();
    this.props.navigation.navigate('details', this.props.cafeDetails);
  };
  
  render () {
    {
      console.tron.log(this.props)
    }
    const { address, name, takeAway, total } = this.props.navigation.state.params;
    const { totalCartPrice, cart } = this.props;
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <OrderView
          style={{ backgroundColor: '#f6f6f6' }}
          titleStyle={{ marginTop: height * 0.1 }}
          cart={this.props.cart}
          title="Your Order Receipt"
          totalCartPrice={this.props.totalCartPrice}
        >
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={[styles.cafeName, {
              marginTop: -10,
              fontSize: 20,
              color: colors.brown
            }]}>{name}</Text>
            <Text
              style={[styles.cafeAddress, { color: colors.brown }]}>{address}</Text>
          </View>
        </OrderView>
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between', marginHorizontal: 10
          }}>
            <Text style={[styles.size, { fontSize: 20 }]}> Total: </Text>
            <Text style={[styles.name, { fontSize: 20 }]}>
              {this.props.totalCartPrice} kr
            </Text>
          </View>
          <View style={{
            marginHorizontal: 10,
            justifyContent: 'space-between',
            marginTop: height * 0.15,
            flexDirection: 'row'
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Mva % </Text>
              <Text style={{ fontSize: 15 }}>{takeAway ? 15 : 25} %</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Mva </Text>
              <Text style={{ fontSize: 15 }}> {takeAway ? totalCartPrice * 0.15 : totalCartPrice * 0.25 }kr </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Netto </Text>
              <Text
                style={{ fontSize: 15 }}> {totalCartPrice - (takeAway ? totalCartPrice * 0.15 : totalCartPrice * 0.25)}kr </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Brutto </Text>
              <Text style={{ fontSize: 15 }}> {totalCartPrice}kr </Text>
            </View>
          </View>
        </View>
        <Button
          title="OK"
          buttonStyle={{ height: height * 0.08, backgroundColor: '#51ade8' }}
          onPress={() => this.confirmReceipt({ address, name, takeAway, total, cart }, total)}/>
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