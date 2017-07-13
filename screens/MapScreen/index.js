import React, { Component, PropTypes } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

import Map from '../../components/MapViewCustomCallouts/Map';
import Modal from 'react-native-modalbox';
import { Location, Permissions } from "expo";
import MapWithCards from './mapWithCards';

import colors from '../../theme/colors';
import styles from './styles';
import CafesList from '../../components/Cafe_List';
import { fetchCafes, searchCafes } from '../../actions';

const { width, height } = Dimensions.get('window');

class MapScreen extends Component {

  static navigationOptions = {
    title: 'Map',
    titleColor: { color: colors.lightBlue },
    tabBarIcon: ({ tintColor }) => <Icon name="map" size={30} color={tintColor}/>,
    header: false,
    tabBarPosition: 'bottom',
    gesturesEnabled: false
  };

  state = {
    location: {},
    errorMessage: 'uppss',
  };

  componentWillMount () {
    this._getLocationAsync();
    this.props.fetchCafes();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  navigateCallback = (route, prop) => {
    this.props.navigation.navigate(route, prop)
  };

  render () {
    return (
      <View style={{ flex: 1 }}>
        <MapWithCards
          userLocation={this.state.location}
          navigation={this.navigateCallback.bind(this)}
          cafesInfo={this.props.cafesInfo}
        />
        {/*<View style={styles.icon}>*/}
          {/*<View style={styles.block}>*/}
            {/*<TouchableOpacity onPress={() => this.refs.modal.open()}>*/}
              {/*<Animatable.View*/}
                {/*animation="pulse"*/}
                {/*easing="ease-in-back"*/}
                {/*iterationCount="infinite"*/}
                {/*ref="view"*/}
                {/*direction="normal"*/}
              {/*>*/}
                  {/*<Image*/}
                    {/*source={require('../../assets/icons/cafe2.png')}*/}
                    {/*style={{ height: 40, width: 40 }}*/}
                  {/*/>*/}
              {/*</Animatable.View>*/}
            {/*</TouchableOpacity>*/}
          {/*</View>*/}
        {/*</View>*/}
        {/*<Modal style={styles.modal} position={"bottom"} ref={"modal"} swipeArea={20}>*/}
          {/*<View style={{ flex: 1, width}}>*/}
            {/*<CafesList*/}
              {/*data={this.props.cafesInfo}*/}
              {/*navigation={this.navigateCallback.bind(this)}*/}
              {/*userLocation={this.state.location}*/}
              {/*searchCafes={this.props.searchCafes.bind(this)}*/}
            {/*/>*/}
          {/*</View>*/}
        {/*</Modal>*/}
      </View>
    );
  }
}

MapScreenPropTypes = {
  cafesInfo: PropTypes.array
};

function mapStateToProps ({ cafes }) {
  return {
    cafesInfo: cafes.cafesInfo
  }
}

export default connect(mapStateToProps, { fetchCafes, searchCafes })(MapScreen);
