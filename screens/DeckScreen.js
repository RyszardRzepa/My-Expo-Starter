import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import * as actions from '../actions';
import FlatList from '../components/FlatList';

class DeckScreen extends Component {
  static navigationOptions = {
    title: 'List',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="description" size={30} color={tintColor}/>;
    }
  }
  
  render () {
    return (
      <View style={{ flex: 1 }}>
        <FlatList/>
      </View>
    );
  }
}

export default connect(null, actions)(DeckScreen);
