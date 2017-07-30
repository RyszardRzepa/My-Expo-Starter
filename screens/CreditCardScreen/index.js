import React, { Component } from 'react';
import { View, Image, Text, TextInput, Picker, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Button, CheckBox } from 'react-native-elements'
import { fillCreditCard } from '../../actions'

import Colors from '../../theme/colors';

const Item = Picker.Item;
const { width, height } = Dimensions.get('window');

class CreditCard extends Component {
  static navigationOptions = {
    title: 'Add Credits',
    headerTitleStyle: { alignSelf: 'center' }
  };
  
  state = {
    credits: 0,
    checked1: false,
    checked2: false,
    checked3: false,
    checked4: false
  };
  
  addCredits = () => {
    this.props.fillCreditCard(this.state.credits, this.navigateCallback)
  };
  
  navigateCallback = () => {
    this.props.navigation.goBack()
  };
  
  onValueChange = (key, value) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  };
  
  render () {
    return (
      <View style={{ flex: 1, marginTop: 50, alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            style={{ height: 120, width: 120 }}
            source={require('../../assets/icons/coins.png')}
          />
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: '#484848' }}>
              {`You have 10 credits  left`} </Text>
          </View>
        </View>
        <View style={{ flex: 1, }}>
          <CheckBox
            containerStyle={{ width,  backgroundColor: 'transparent', }}
            left
            onPress={() => this.setState({
              checked1: !this.state.checked1,
              credits: 50,
              checked2: false,
              checked3: false,
              checked4: false,
            })}
            title='50 NOK'
            textStyle={{ fontSize: 20 }}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={this.state.checked1}
          />
          <CheckBox
            containerStyle={{ backgroundColor: 'transparent' }}
            left
            onPress={() => this.setState({
              checked2: !this.state.checked2,
              credits: 100,
              checked1: false,
              checked3: false,
              checked4: false,
              
            })}
            title='100 NOK'
            textStyle={{ fontSize: 20 }}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={this.state.checked2}
          />
          <CheckBox
            containerStyle={{ backgroundColor: 'transparent', justifyContent: 'space-between' }}
            left
            onPress={() => this.setState({
              checked3: !this.state.checked3,
              credits: 200,
              checked1: false,
              checked2: false,
              checked4: false,
            })}
            title='200 NOK'
            textStyle={{ fontSize: 20 }}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={this.state.checked3}
          />
          <CheckBox
            containerStyle={{ backgroundColor: 'transparent', justifyContent: 'space-between' }}
            left
            onPress={() => this.setState({
              checked4: !this.state.checked4,
              credits: 200,
              checked1: false,
              checked2: false,
              checked3: false,
            })}
            title='500 NOK'
            textStyle={{ fontSize: 20 }}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={this.state.checked4}
          />
        </View>
        <Button
          buttonStyle={{ borderRadius: 5, width: width * 0.95, marginTop: 20, marginBottom: 20, backgroundColor: Colors.green }}
          onPress={() => this.addCredits()}
          title='Add credits'
        />
      </View>
    )
  }
}

export default connect(null, { fillCreditCard })(CreditCard)
