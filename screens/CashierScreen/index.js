import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { connect } from 'react-redux';

import { cashierConfirmOrder, clearCart } from '../../actions';
import styles from './styles';

class CashierScreen extends Component {
  static navigationOptions = {
    title: 'Type Pin Code',
    headerRight: (<Text />),
    headerTitleStyle: { alignSelf: 'center' },
  };
  
  state = {
    pinCode: '',
    isModalOpen: false
  };
  
  navigateTo = () => {
    this.props.navigation.goBack();
    this.props.clearCart();
  };
  
  onPinCodeClick = async (pin) => {
    const { total, pinCode, name, address } = this.props.navigation.state.params;
    
    await this.setState({ pinCode: this.state.pinCode.concat(pin) });
    
    if (this.state.pinCode === pinCode.toString()) {
      this.props.navigation.navigate('receipt', {name, address});
      // Alert.alert(
      //   'Pin code Success',
      //   'loading...',
      //   [
      //     {
      //       text: 'OK', onPress: () => {
      //       this.props.cashierConfirmOrder(
      //         total,
      //         this.props.navigation.state.params,
      //         this.navigateTo
      //       );
      //     }
      //     },
      //   ],
      //   { cancelable: false }
      // );
      await this.setState({ pinCode: '' });
    }
    if (this.state.pinCode.length > 3) {
      Alert.alert(
        'Pin Code',
        'Wrong pin code try again',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
      this.setState({ pinCode: '' });
    }
  };
  
  renderButton = (from, to) => {
    let buttons = [];
    for (let i = from; i <= to; i++) {
      buttons.push(<Button
        key={i}
        buttonStyle={styles.buttonStyle}
        Component={TouchableOpacity}
        containerViewStyle={{ borderRadius: 45 }}
        large
        fontSize={30}
        borderRadius={40}
        title={i.toString()}
        onPress={() => this.onPinCodeClick(i.toString())}
      />)
    }
    return buttons.map(item => {
      return item;
    })
  };
  
  render () {
    const { name, address } = this.props.navigation.state.params;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.basketContentContainer}>
            <Text style={styles.cafeName}>{name}</Text>
            <Text style={styles.cafeAddress}>{address}</Text>
            <ScrollView style={{ width: 280 }}>
              {this.props.navigation.state.params.cart.map((item, i) => {
                return <View key={i} style={styles.orderContainer}>
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.size}>{item.size}</Text>
                  </View>
                  <View style={styles.countContainer}>
                    <Text style={styles.count}>{item.count}</Text>
                  </View>
                </View>
              })}
            </ScrollView>
          </View>
          
          <Divider style={{ height: 1, backgroundColor: '#ccc5c9', margin: 20 }}/>
          
          <View style={{ backgroundColor: '#484848', flex: 3 }}>
            <Text style={styles.pinCodeInfo}>
              Show your phone to the cashier to enter pin code
            </Text>
            <View style={{
              marginBottom: 20,
              flexDirection: 'row', justifyContent: 'space-between'
            }}>
              {this.renderButton(1, 3)}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {this.renderButton(4, 6)}
            </View>
          </View>
        </View>
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

export default connect(mapStateToProps, { cashierConfirmOrder, clearCart })(CashierScreen);