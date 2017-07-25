import React, { Component, PropTypes } from 'react';
import {
  View,
  Dimensions,
  TextInput,
  Text,
  AsyncStorage,
  TouchableOpacity,
  NativeModules,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

class SettingsScreen extends Component {
  state = {
    text: '',
    isLoading: false,
  };
  
  onLogOut = () => {
    AsyncStorage.removeItem('token');
    this.props.navigation.navigate('welcome');
  };

  onClear = () => {
    this.setState({ isLoading: true });
    if (Platform.OS === 'android') {
      NativeModules.Payment.unregisterCreditCard((callback) => { // calling native module to remove the all registered cards
        if (callback == "success") {
          this.setState({ isLoading: false });
        }
      });
    } else {
      NativeModules.Payment.unregisterCreditCard((callback, events) => { // calling native module to remove the all registered cards
        if (callback == "success") {
          this.setState({ isLoading: false });
        }
      });
    }
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
        <View style={{ backgroundColor: '#47b1e8', width: 250, height: 40, marginLeft: (width - 250) / 2, marginBottom: 100, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => this.onClear()}>
            <Text style={{ fontSize: 20, color: '#fff' }}> Remove Credit Cards </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: '#47b1e8', height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => this.onLogOut()}>
            <Text style={{ fontSize: 20, color: '#fff' }}> Logout </Text>
          </TouchableOpacity>
        </View>
        {
          this.state.isLoading &&
          <View style={{
            position: "absolute",
            width: width,
            height: height,
            alignSelf: "stretch",
            backgroundColor: "rgba(0,0,0,0.5)",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <ActivityIndicator animating={true} size="small" color="white" />
          </View>
        }
      </View>
    
    )
  }
}

export default connect(null)(SettingsScreen);