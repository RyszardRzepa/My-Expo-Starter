import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';

class CheckBoxComponent extends Component {
  render () {
    return (
      <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text> Take away? </Text>
          {this.props.checked ? <CheckBox
            containerStyle={{ width: 80 }}
            center
            title='Yes'
            checked={this.props.checked}
            onPress={this.props.onPress}
          /> : <CheckBox
            containerStyle={{ width: 80 }}
            center
            title='No'
            checked={this.props.checked}
            onPress={this.props.onPress}
          />}
        </View>
      </View>
    )
  }
}

export default CheckBoxComponent;
