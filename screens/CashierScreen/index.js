import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  TouchableHighlight
} from 'react-native';
import { Button, Divider, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { clearCart, cashierConfirmOrder } from '../../actions';
import Receipt from '../../components/Receipt';
import Header from '../../components/common/Header';
import styles from './styles';

const { width, height } = Dimensions.get('window');

const CustomLayoutAnimation = {
  duration: 250,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
  },
};
class CashierScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };
  
  state = {
    pinCode: '',
    isModalOpen: false,
    receipt: false
  };
  
  componentWillUpdate () {
    LayoutAnimation.configureNext(CustomLayoutAnimation);
  }
  
  onPinCodeClick = async (pin) => {
    const { total, pinCode, name, address, takeAway } = this.props.navigation.state.params;
    
    await this.setState({ pinCode: this.state.pinCode.concat(pin) });
    
    if (this.state.pinCode === pinCode.toString()) {
      //this.props.navigation.navigate('receipt', {total, name,takeAway,address});
      await this.setState({ pinCode: '', receipt: true });
    }
    if (this.state.pinCode.length > 3) {
      Alert.alert(
        'Pin Code',
        'Wrong pin code try again',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
      this.setState({ pinCode: '' });
    }
  };
  
  renderReceipt = () => {
    const { total, name, address, takeAway } = this.props.navigation.state.params;
    const { cart, totalCartPrice } = this.props;
    if (this.state.receipt)
      return <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        flex: 1,
        width,
        height,
        zIndex: 4,
        elevation: 4,
      }}>
        <Receipt
          title='Your Order Receipt'
          cafeName={name}
          takeAway={takeAway}
          total={total}
          address={address}
          totalCartPrice={totalCartPrice}
          cart={cart}
        />
        <TouchableHighlight underlayColor="#fff" activeOpacity={0.8} onPress={() => this.confirmReceipt({ address, name, takeAway, total, cart }, total)}>
          <View
            style={styles.buttonContainer}>
            <Text style={{ fontSize: 20, color: '#fff' }}> OK </Text>
          </View>
        </TouchableHighlight>
      </View>;
  };
  
  confirmReceipt = async (order, total) => {
    await  this.props.cashierConfirmOrder(order, total);
    await this.props.clearCart();
    this.props.navigation.goBack();
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
        {this.renderReceipt()}
        <Header>
          <Icon
            underlayColor='transparent'
            name="keyboard-arrow-left"
            size={37}
            color="#fff"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: '500', marginRight: 30 }}> Type Pin Code </Text>
          <Text></Text>
        </Header>
        <View style={styles.container}>
          <View style={styles.basketContentContainer}>
            <Text style={styles.cafeName}>{name}</Text>
            <Text style={styles.cafeAddress}>{address}</Text>
            <ScrollView style={{ width }}>
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
              <Divider style={{ width }}/>
            </ScrollView>
          </View>
          
          <Divider style={{ height: 1, backgroundColor: '#ccc5c9', marginTop: 20, marginBottom: 20 }}/>
          <View style={{ backgroundColor: '#484848', flex: 3, width }}>
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

CashierScreenPropTypes = {
  cart: PropTypes.array,
  totalCartItems: PropTypes.number,
  totalCartPrice: PropTypes.number
};

mapStateToProps = ({ cart }) => {
  return {
    cart: cart.cartItems,
    totalCartItems: cart.totalCartItems,
    totalCartPrice: cart.totalCartPrice,
  }
};

export default connect(mapStateToProps, {cashierConfirmOrder, clearCart })(CashierScreen);