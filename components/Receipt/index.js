import React, { Component, PropTypes } from 'react';
import { View, Text, Dimensions } from 'react-native';
import OrderView from '../OrderView';
import styles from './styles';
import colors from '../../theme/colors';
import { Divider } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

class Receipt extends Component {
  countTax = (takeAway, totalCartPrice) => {
    if (takeAway) {
      return (totalCartPrice * 0.15).toFixed(2);
    }
    return (totalCartPrice * 0.25).toFixed(2)
  };
  
  render () {
    const { title, address, cafeName, takeAway, totalCartPrice, cart } = this.props;
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <OrderView
          style={{ backgroundColor: '#f6f6f6', marginHorizontal: 20 }}
          titleStyle={{ marginTop: height * 0.1 }}
          cart={cart}
          title={title}
          totalCartPrice={totalCartPrice}
        >
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={[styles.cafeName, {
              color: colors.brown
            }]}>{cafeName}</Text>
            <Text
              style={[styles.cafeAddress, { color: colors.brown }]}>{address}</Text>
          </View>
        </OrderView>
        <View style={{ flex: 1 }}>
          <View style={styles.priceTotal}>
            <Text style={[styles.size, { fontSize: 20 }]}> Total: </Text>
            <Text style={[styles.name, { fontSize: 20 }]}>
              {this.props.totalCartPrice} kr
            </Text>
          </View>
          <View style={styles.mvaContainer}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Mva % </Text>
              <Text style={{ fontSize: 15 }}>{takeAway ? 15 : 25} %</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Mva </Text>
              <Text style={{ fontSize: 15 }}> {this.countTax(takeAway, totalCartPrice)}kr </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Netto </Text>
              <Text
                style={{ fontSize: 15 }}> {totalCartPrice - this.countTax(takeAway, totalCartPrice)}kr </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Brutto </Text>
              <Text style={{ fontSize: 15 }}> {totalCartPrice}kr </Text>
            </View>
          </View>
          <Divider style={{ width, height: 0.7, marginTop: 10 }}/>
        </View>
      </View>
    )
  }
}

ReceiptPropTypes = {
  title: PropTypes.string,
  address: PropTypes.string,
  cafeName: PropTypes.string,
  takeAway: PropTypes.bool,
  totalCartPrice: PropTypes.num,
  cart: PropTypes.array
};

export default Receipt;