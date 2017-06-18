import React, { Component } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import OrderView from '../OrderView';
import styles from './styles';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

class Receipt extends Component {
  render () {
    const { address, name, takeAway, total, totalCartPrice, cart } = this.props;
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <OrderView
          style={{ backgroundColor: '#f6f6f6' }}
          titleStyle={{ marginTop: height * 0.1 }}
          cart={cart}
          title={name}
          totalCartPrice={totalCartPrice}
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
      </View>
    )
  }
}

export default Receipt;