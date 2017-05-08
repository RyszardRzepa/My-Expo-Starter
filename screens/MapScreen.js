import React, { Component } from 'react';
import { View } from 'react-native';
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
  
  componentWillMount () {
    this.props.FetchCafes();
  }
  
  componentDidMount () {
    this.setState({ mapLoaded: true });
  }
  
  navigateCallback (route, prop) {
    this.props.navigation.navigate(route, prop)
  }
  
  render () {
    return (
      <View style={{ flex: 1 }}>
        <Map
          navigation={this.navigateCallback.bind(this)}
          cafesInfo={this.props.cafesInfo}
        />
      </View>
    );
  }
}

function mapStateToProps (state) {
  return {
    cafesInfo: state.cafes.cafesInfo
  }
}

export default connect(mapStateToProps, { FetchCafes })(MapScreen);