import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import Receipt from '../../components/Receipt';

class OrderHistoryDetail extends Component {
  static navigationOptions = {
    title: 'Order Receipt',
  };
  
  render () {
    const { address, name, takeAway, total, cart } = this.props.navigation.state.params.order;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 3 }}>
          <Receipt
            title='Your Order Receipt'
            cafeName={name}
            takeAway={takeAway}
            address={address}
            totalCartPrice={total}
            cart={cart}
            date={this.props.navigation.state.params.date}
          />
        </View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
        }}>
          
          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 1, }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Image
                style={{ width: 105, height: 105 }}
                resizeMode='contain'
                source={require('../../assets/icons/logoWithName.png')}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, color: "#2a87c1", fontWeight: '600' }}>Coffee Cloud</Text>
              <Text style={{ fontSize: 14 }}>Org.nr: 9821234</Text>
              <Text style={{ fontSize: 14 }}>Date: </Text>
              <Text style={{ fontSize: 14 }}>receipt nr. 323221 </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default OrderHistoryDetail;