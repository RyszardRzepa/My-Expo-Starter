import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions
} from 'react-native';
import { MapView } from "expo";
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

import styles from './styles';

import CustomCallout from './CustomCallout';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 59.911491;
const LONGITUDE = 10.757933;
const LATITUDE_DELTA = 0.1122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Map extends Component {
  constructor (props) {
    super(props);
    
    this.state = {
      isReadyMedia: true,
      open: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
  }
  
  render () {
    if (!this.props.cafesInfo) {
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
    
    return (
      <View style={styles.container}>
        <MapView
          showUSerLocation
          loadingBackgroundColor="#f9f5ed"
          style={styles.map}
          initialRegion={this.state.region}
        >
          {this.props.cafesInfo.map((item) => {
            const { location, address, image, menu, pinCode, name } = item;
            
            return <MapView.Marker.Animated
              key={location.latitude}
              showsUserLocation
              loadingBackgroundColor="#f9f5ed"
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              image={require('../../assets/icons/ccLogo.png')}
            >
              <MapView.Callout
                onPress={ () => this.props.navigation(
                  'details', { address, image, menu, pinCode, name }
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

Map.propTypes = {
  cafesInfo: PropTypes.array
};

export default Map;