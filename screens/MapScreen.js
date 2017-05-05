import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import Map from '../components/MapViewCustomCallouts/Map';

import { FetchCafes } from '../actions';

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="my-location" size={30} color={tintColor}/>;
    }
  };
  
  componentWillMount() {
    this.props.FetchCafes();
  }
  
  componentDidMount () {
    this.setState({ mapLoaded: true });
  }
  
  render () {
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

export default connect(mapStateToProps, { FetchCafes })(MapScreen);