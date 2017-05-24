import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Alert
} from "react-native";
import { Button } from 'react-native-elements';

import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

const s = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

const USE_LITE_CREDIT_CARD_INPUT = false;

export default class CreditCard extends Component {
  state = {
    formData: null
  };
  
  _onChange = async formData => {
    this.setState({ formData: formData});
  };
  
  onButtonPress = () => {
    Alert.alert(
      'Credit card',
      `${this.state.formData.name}, your card is registered`,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    )
  };
  
  _onFocus = field => {
    console.log(field);
  };
  
  render() {
    return (
      <View>
        <View style={s.container}>
          { USE_LITE_CREDIT_CARD_INPUT ?
            (<LiteCreditCardInput
              autoFocus
              inputStyle={s.input}
              
              validColor={"black"}
              invalidColor={"red"}
              placeholderColor={"darkgray"}
              
              onFocus={this._onFocus}
              onChange={this._onChange} />) :
            (<CreditCardInput
              autoFocus
              
              requiresName
              requiresCVC
              
              labelStyle={s.label}
              inputStyle={s.input}
              validColor={"black"}
              invalidColor={"red"}
              placeholderColor={"darkgray"}
              
              onFocus={this._onFocus}
              onChange={this._onChange} />)
          }
        </View>
        <Button
          containerViewStyle={{ marginTop: 30 }}
          title="Register card"
          raised
          onPress={() => this.onButtonPress()}
        />
      </View>
    );
  }
}