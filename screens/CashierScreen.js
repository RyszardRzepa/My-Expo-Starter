import React, { Component } from 'react';
import { View, Text, Dimensions, Alert } from 'react-native';
import { Button, Divider } from 'react-native-elements';

const { height, width } = Dimensions.get('window');

class CashierScreen extends Component {
  state = {
    pinCode: '',
  };
  
  onPinCodeSuccess = () => {
    if (this.state.pinCode === this.props.navigation.state.params.pinCode.toString()) {
      console.log("pinCode success");
    }
  };
  
  onPinCodeClick = async (pin) => {
    await this.setState({ pinCode: this.state.pinCode.concat(pin) });
    if (this.state.pinCode === this.props.navigation.state.params.pinCode.toString()) {
      Alert.alert(
        'Pin code Success',
        'Transaction completed',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
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
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
      this.setState({ pinCode: '' });
    }
  };
  
  render () {
    {
      console.log("pinCoe state render", this.state.pinCode)
    }
    return (
      <View style={{
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <View>
          <Text>
            order details
            {/*{console.log("cart props cashier", this.props.navigation.state.params)}*/}
          </Text>
        </View>
        <View style={{ marginBottom: height * 0.08 }}>
          <Divider style={{ height: 1, backgroundColor: '#ccc5c9', margin: 20 }}/>
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

const styles = {
  buttonStyle: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#59bcfe'
  }
};
export default CashierScreen;