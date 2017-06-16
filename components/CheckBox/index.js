import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';

class CheckBoxComponent extends Component {
  render () {
    return (
      <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox
            center
            title='Yes'
            checked={this.props.checked}
            onPress={this.props.onPress}
          />
          <Text> Take away? </Text>
          <CheckBox
            center
            title='No'
            checked={!this.props.checked}
            onPress={this.props.onPress}
          />
        </View>
      </View>
    )
  }
}

export default CheckBoxComponent;
