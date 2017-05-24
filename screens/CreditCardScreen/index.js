import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { SearchBar, Button } from 'react-native-elements'
import { FillCreditCard } from '../../actions'

class CreditCard extends Component {
  state = {
    text: ''
  };
  
  addCredits = () => {
    this.props.FillCreditCard(this.state.text)
  };
  
  render () {
    return (
      <View style={{ flex: 1, marginTop: 100, }}>
        <SearchBar
          onChangeText={(event) => this.setState({ text: event })}
          placeholder='Type Here...' />
        <Button
          onPress={() => this.addCredits()}
          title='Add credits'
        />
      </View>
    )
  }
}

export default connect(null, { FillCreditCard })(CreditCard)
