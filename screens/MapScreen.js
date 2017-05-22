import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import Map from '../components/MapViewCustomCallouts/Map';
import Modal from 'react-native-modalbox';

import styles from './styles/map_screen';
import CafesList from '../components/Cafes_List';
import { FetchCafes } from '../actions';

const screen = Dimensions.get('window');

class MapScreen extends Component {
  
  static navigationOptions = {
    title: 'Map',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="my-location" size={30} color={tintColor}/>;
    },
    header: false
  };
  
  constructor () {
    super();
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3
    };
  }
  
  componentWillMount () {
    this.props.FetchCafes();
  }
  
  componentDidMount () {
    this.setState({ mapLoaded: true });
  }
  
  navigateCallback = (route, prop) => {
    this.props.navigation.navigate(route, prop)
  }
  
  render () {
    return (
      <View style={{ flex: 1 }}>
        <Map
          navigation={this.navigateCallback.bind(this)}
          cafesInfo={this.props.cafesInfo}
        />
        <View style={styles.icon}>
          <Icon
            size={26}
            raised
            name='free-breakfast'
            underlayColor="#EFEBE9"
            color='#c0392b'
            onPress={() => this.refs.modal6.open()}
          />
        
        </View>
        <Modal style={[styles.modal4]} position={"bottom"} ref={"modal6"} swipeArea={20}>
          <View style={{ flex: 1, width: screen.width }}>
            <CafesList
              data={this.props.cafesInfo}
              navigation={this.navigateCallback.bind(this)}
            />
          </View>
        </Modal>
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