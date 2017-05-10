import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { MapView } from "expo";
import styles from './styles';

import CustomCallout from './CustomCallout';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 59.911491;
const LONGITUDE = 10.757933;
const LATITUDE_DELTA = 0.1122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Map extends React.Component {
  constructor (props) {
    super(props);
    
    this.state = {
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
    {
      if (!this.props.cafesInfo) {
        return <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator animating size="large"/>
        </View>
      }
    }
    
    return (
      <View style={styles.container}>
        <MapView
          showUSerLocation
          loadingBackgroundColor="#f9f5ed"
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
        >
          {this.props.cafesInfo.map((item) => {
            const { location, address, image, menu } = item;
            
            return <MapView.Marker
              key={location.latitude}
              showsUserLocation
              loadingBackgroundColor="#f9f5ed"
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
            >
              <MapView.Callout tooltip style={styles.customView}>
                <CustomCallout>
                  <TouchableOpacity
                    onPress={() => this.props.navigation('details', { address, image, menu })}>
                    <Image
                      source={{ uri: image }}
                      style={{ height: 60 }}
                    />
                    <Text style={{ color: '#27313c' }}>{address}</Text>
                  </TouchableOpacity>
                </CustomCallout>
              </MapView.Callout>
            </MapView.Marker>
          })}
        </MapView>
      </View>
    );
  }
}

Map.propTypes = {
  provider: MapView.ProviderPropType,
};

export default Map;