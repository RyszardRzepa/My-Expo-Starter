import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView, Alert } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import styles from './styles/cashier_screen';

const { height, width } = Dimensions.get('window');

class CashierScreen extends Component {
  state = {
    pinCode: '',
  };
  
  onPinCodeClick = async (pin) => {
    await this.setState({ pinCode: this.state.pinCode.concat(pin) });
    if (this.state.pinCode === this.props.navigation.state.params.pinCode.toString()) {
      Alert.alert(
        'Pin code Success',
        'Transaction completed',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
      this.setState({ pinCode: '' });
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
  
  render () {
    const { name, address } = this.props.navigation.state.params;
    return (
      <View style={{
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
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
        
        <View style={{ flex: 3, marginBottom: height * 0.08 }}>
          <Divider style={{ height: 1, backgroundColor: '#ccc5c9', margin: 20 }}/>
          <Text style={styles.pinCodeInfo}>
            Show your phone to the cashier to enter pin code
          </Text>
          <View style={{
            marginBottom: height * 0.05,
            flexDirection: 'row', justifyContent: 'space-between'
          }}>
            <Button
              buttonStyle={styles.buttonStyle}
              large
              fontSize={30}
              borderRadius={40}
              raised
              title='1'
              onPress={() => this.onPinCodeClick('1')}
            />
            <Button
              buttonStyle={styles.buttonStyle}
              large
              fontSize={30}
              borderRadius={45}
              raised
              title='2'
              onPress={() => this.onPinCodeClick('2')}
            />
            <Button
              buttonStyle={styles.buttonStyle}
              large
              fontSize={30}
              borderRadius={50}
              raised
              title='3'
              onPress={() => this.onPinCodeClick('3')}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              buttonStyle={styles.buttonStyle}
              large
              fontSize={30}
              borderRadius={45}
              raised
              title='4'
              onPress={() => this.onPinCodeClick('4')}
            />
            <Button
              buttonStyle={styles.buttonStyle}
              large
              fontSize={30}
              borderRadius={45}
              raised
              title='5'
              onPress={() => this.onPinCodeClick('5')}
            />
            <Button
              buttonStyle={styles.buttonStyle}
              large
              fontSize={30}
              borderRadius={45}
              raised
              title='6'
              onPress={() => this.onPinCodeClick('6')}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default CashierScreen;