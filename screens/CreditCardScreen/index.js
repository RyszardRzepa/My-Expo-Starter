import React, { Component } from 'react';
import { View, TextInput, Picker, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements'
import { fillCreditCard } from '../../actions'

const Item = Picker.Item;
const { width, height } = Dimensions.get('window');

class CreditCard extends Component {
  static navigationOptions = {
    title: 'Add Credits',
    headerTitleStyle: { alignSelf: 'center'}
  };
  
  state = {
    credits: 100,
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
      <View style={{ flex: 1, marginTop: 100, }}>
        <Picker
          style={{ width }}
          selectedValue={this.state.credits}
          onValueChange={this.onValueChange.bind(this, 'credits')}>
          <Item label="100kr" value={100} />
          <Item label="200kr" value={200} />
          <Item label="300kr" value={300} />
        </Picker>
        <Button
          buttonStyle={{ marginTop: 50 }}
          onPress={() => this.addCredits()}
          title='Add credits'
        />
      </View>
    )
  }
}

export default connect(null, { fillCreditCard })(CreditCard)
