import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { MapView, Location, Permissions } from "expo";
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import  calculateDistance from '../../services/calculateDistance';

import styles from './styles';

import CustomCallout from './CustomCallout';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 59.911491;
const LONGITUDE = 10.757933;
const LATITUDE_DELTA = 0.1122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Map extends Component {
  state = {
    open: false,
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
  };
  
  componentDidMount () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ position });
      },
      (error) => {
        console.log(alert(error));
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }
  
  render () {
    if (!this.props.cafesInfo || !this.props.userLocation) {
      return <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#5dbdff'
        }}
      >
        <View style={styles.block}>
          <Animatable.View
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            ref="view"
          >
            <Icon
              name="map"
              size={110}
              iconStyle={{ color: '#468dbf' }}
            />
          </Animatable.View>
        </View>
      </View>
    }
    
    if(this.props.userLocation.coords) {
      console.log("props from Map: ", this.props);
    }
    
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          loadingBackgroundColor="#f9f5ed"
          style={styles.map}
          initialRegion={this.state.region}
          provider={this.props.provider}
        >
          {this.props.cafesInfo.map((item) => {
            const { location, address, image, menu, pinCode, name } = item;
            let distance;
            
            if (this.props.userLocation.coords) {
              const { latitude, longitude } = this.props.userLocation.coords;
              distance = calculateDistance(latitude, longitude, item.location.latitude, item.location.longitude, "K")
            }
            return <MapView.Marker.Animated
              key={location.latitude}
              loadingBackgroundColor="#f9f5ed"
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
            >
              <Image style={styles.markerImage} source={require('../../assets/icons/ccLogo.png')}/>
              <MapView.Callout
                onPress={ () => this.props.navigation('details', { item, distance }
                )}
                tooltip style={styles.customView}
              >
                <CustomCallout>
                  <Image
                    source={{ uri: image }}
                    style={{ height: 60 }}
                  />
                  <Text numberOfLines={1} style={{ color: '#27313c' }}>{address}</Text>
                </CustomCallout>
              </MapView.Callout>
            </MapView.Marker.Animated>
          })}
        </MapView>
      </View>
    );
  }
}

MapPropTypes = {
  cafesInfo: PropTypes.array,
  provider: MapView.ProviderPropType,
};

mapStateToProps = ({ cafes }) => {
  return {
    cafesLocation: cafes.cafesInfo,
  }
};

export default connect(mapStateToProps, { calculateDistance })(Map);