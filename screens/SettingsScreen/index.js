import React, { Component, PropTypes } from 'react';
import  { View, Dimensions, TextInput, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

class SettingsScreen extends Component {
  state = {
    text: ''
  };
  
  onLogOut = () => {
    AsyncStorage.removeItem('token');
    this.props.navigation.navigate('welcome');
  };
  
  render () {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', margin: 10 }}>
            <Text style={{ fontSize: 18, color: '#cccdd1' }}> Change Email</Text>
          </View>
          <View  style={{ height: 40, backgroundColor: '#dedfe3', flexDirection: 'row' }}>
            <Icon containerStyle={{ marginHorizontal: 20 }} name="email" size={20}/>
            <TextInput
              placeholder='email'
              style={{ height: 40, flex: 1 }}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />
          </View>
        </View>
        <View style={{ backgroundColor: '#47b1e8', height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => this.onLogOut()}>
            <Text style={{ fontSize: 20, color: '#fff' }}> Logout </Text>
          </TouchableOpacity>
        </View>
      </View>
    
    )
  }
}

export default connect(null)(SettingsScreen);