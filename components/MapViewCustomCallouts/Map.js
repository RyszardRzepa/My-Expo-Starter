import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Image
} from 'react-native';
import { MapView } from "expo";
import _ from 'lodash';

import CafesList from '../Cafes_List';
import FlatList from '../FlatList';
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
    this.toggleCard = this.toggleCard.bind(this);
  }
  
  componentWillMount () {
    this.animated = new Animated.Value(0);
  }
  
  toggleCard () {
    this.setState((state) => ({
      open: !state.open
    }), () => {
      const toValue = this.state.open ? 1 : 0;
      Animated.timing(this.animated, {
        toValue,
        duration: 500
      }).start();
    })
  }
  
  renderCafesList () {
    return (
      <CafesList
        data={this.props.cafesInfo}
      />
    )
  }
  
  render () {
    const offsetInterpolate = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [351, 70]
    });
    const arrowRotate = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: ["180deg", "0deg"]
    });
    const offsetStyle = {
      transform: [{ translateY: offsetInterpolate }]
    };
    const arrowStyle = {
      transform: [{ rotate: arrowRotate }]
    };
    
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
          loadingBackgroundColor="#f9f5ed"
          showsUserLocation
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
        >
          {this.props.cafesInfo.map((item) => {
            return <MapView.Marker
              key={item.location.latitude}
              showsUserLocation
              loadingBackgroundColor="#f9f5ed"
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude
              }}
            >
              <MapView.Callout tooltip style={styles.customView}>
                <CustomCallout>
                  <Image
                    source={{ uri: item.image }}
                    style={{ height: 60 }}
                  />
                  <Text style={{ color: '#27313c' }}>{item.address}</Text>
                </CustomCallout>
              </MapView.Callout>
            </MapView.Marker>
          })}
          
          <Animated.View style={[styles.card, offsetStyle]}>
            <TouchableOpacity onPress={this.toggleCard}>
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Click here</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Animated.Text style={[styles.arrow, arrowStyle]}>↓</Animated.Text>
                </View>
              </View>
            </TouchableOpacity>
            <Animated.View style={[styles.scrollViewWrap]}>
              <CafesList data={this.props.cafesInfo}/>
            </Animated.View>
          </Animated.View>
        </MapView>
      </View>
    );
  }
}

Map.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollViewWrap: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff8fc",
    flex: 1,
    transform: [{ translateY: 191, }]
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#333",
    justifyContent: "center"
  },
  arrowContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  background: {
    width: width,
    height: height,
  },
  arrow: {
    fontSize: 30,
    color: "#333"
  },
  customView: {
    width: 140,
    height: 100,
  },
  plainView: {
    width: 60,
  },
  map: {
    marginTop: 60,
    width: width,
    height: height,
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

export default Map;