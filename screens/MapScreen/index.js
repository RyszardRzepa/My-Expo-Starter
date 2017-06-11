import React, { Component, PropTypes } from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import Map from '../../components/MapViewCustomCallouts/Map';
import Modal from 'react-native-modalbox';

import colors from '../../theme/colors';
import styles from './styles';
import CafesList from '../../components/Cafe_List';
import { fetchCafes } from '../../actions';

const screen = Dimensions.get('window');

class MapScreen extends Component {
  
  static navigationOptions = {
    title: 'Map',
    titleColor: { color: colors.lightBlue },
    tabBarIcon: ({ tintColor }) => <Icon name="map" size={30} color={tintColor}/>,
    header: false,
    tabBarPosition: 'bottom',
  };
  
  componentWillMount () {
    this.props.fetchCafes();
  }
  
  componentDidMount () {
    this.setState({ mapLoaded: true });
  }
  
  navigateCallback = (route, prop) => {
    this.props.navigation.navigate(route, prop)
  };
  
  render () {
    return (
      <View style={{ flex: 1 }}>
        <Map
          navigation={this.navigateCallback.bind(this)}
          cafesInfo={this.props.cafesInfo}
        />
        <View style={styles.icon}>
          <Icon
            containerStyle={{ backgroundColor: colors.darkWhite }}
            size={26}
            raised
            name='free-breakfast'
            underlayColor="#EFEBE9"
            color={colors.darkBrown}
            onPress={() => this.refs.modal.open()}
          />
        </View>
        <Modal style={styles.modal} position={"bottom"} ref={"modal"} swipeArea={20}>
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

MapScreen.propTypes = {
  cafesInfo: PropTypes.array
};

function mapStateToProps (state) {
  return {
    cafesInfo: state.cafes.cafesInfo
  }
}

export default connect(mapStateToProps, { fetchCafes })(MapScreen);