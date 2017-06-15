import React, { Component } from 'react';
import  { View, Text, Dimensions } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { connect } from 'react-redux';

import OrderView from '../../components/OrderView';
import styles from './styles';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

class ReceiptScreen extends Component {
  static navigationOptions = {
    header: false,
    tabBarVisible: false,
  };
  
  render () {
    {
      console.tron.log(this.props)
    }
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <OrderView
          style={{ backgroundColor: '#f6f6f6' }}
          titleStyle={{ marginTop: height * 0.1 }}
          cart={this.props.cart}
          title="Your Order Receipt"
          totalCartPrice={this.props.totalCartPrice}
          cafeName={this.props.navigation.state.params.name}
          cafeAddress={this.props.navigation.state.params.address}
        >
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={[styles.cafeName, {
              marginTop: -10,
              fontSize: 20,
              color: colors.brown
            }]}>{this.props.navigation.state.params.name}</Text>
            <Text
              style={[styles.cafeAddress, { color: colors.brown }]}>{this.props.navigation.state.params.address}</Text>
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
              <Text style={{ fontSize: 15 }}> 15% </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Mva </Text>
              <Text style={{ fontSize: 15 }}> 12kr </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Netto </Text>
              <Text style={{ fontSize: 15 }}> 21kr </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Brutto </Text>
              <Text style={{ fontSize: 15 }}> 30kr </Text>
            </View>
          </View>
        </View>
        <Button title="OK" buttonStyle={{ height: height * 0.08, backgroundColor: '#51ade8' }}
                onPress={() => console.log()}/>
      </View>
    )
  }
}

mapStateToProps = ({ cart }) => {
  return {
    cart: cart.cartItems,
    totalCartItems: cart.totalCartItems,
    totalCartPrice: cart.totalCartPrice,
  }
};

export default connect(mapStateToProps)(ReceiptScreen);