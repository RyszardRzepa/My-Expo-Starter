import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import Map from '../components/MapViewCustomCallouts/Map';

import * as actions from '../actions';

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="my-location" size={30} color={tintColor}/>;
    }
  }
  
  state = {
    mapLoaded: false,
  }
  
  componentDidMount () {
    this.setState({ mapLoaded: true });
  }
  
  render () {
    {
      console.log(this.props)
    }
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large"/>
        </View>
      );
    }
    
    return (
      <View style={{ flex: 1 }}>
        <Map coordinates={this.props.coordinates}/>
      </View>
    );
  }
}

function mapStateToProps (state) {
  return {
    coordinates: state.cafes.cafesName
  }
}

export default connect(mapStateToProps, actions)(MapScreen);