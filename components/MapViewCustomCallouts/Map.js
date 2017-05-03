import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView from 'react-native-maps';

import CustomCallout from './CustomCallout';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 59.911491;
const LONGITUDE = 10.757933;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

class Callouts extends React.Component {
  constructor (props) {
    super(props);
    
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: []
    };
  }
  
  componentWillReceiveProps (nextProps) {
    this.setState({ markers: nextProps })
  }
  
  renderMap () {
    if (!this.props.coordinates) {
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
    
    return <MapView
      provider={this.props.provider}
      style={styles.map}
      initialRegion={this.state.region}
    >
      {this.props.coordinates.map((marker) => {
        console.log("markers", marker)
        return <MapView.Marker
          key={marker.latitude}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude
          }}
          calloutOffset={{ x: -8, y: 28 }}
          calloutAnchor={{ x: 0.5, y: 0.4 }}
        >
          <MapView.Callout tooltip style={styles.customView}>
            <CustomCallout>
              <Text>This is a custom callout bubble view</Text>
            </CustomCallout>
          </MapView.Callout>
        </MapView.Marker>
      })}
    </MapView>
  }
  
  render () {
    return (
      <View style={styles.container}>
        {this.renderMap()}
      </View>
    );
  }
}

Callouts.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  customView: {
    width: 140,
    height: 100,
  },
  plainView: {
    width: 60,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default Callouts;