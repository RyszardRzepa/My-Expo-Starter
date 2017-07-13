import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { connect } from 'react-redux';
import  calculateDistance from '../../services/calculateDistance';
import CustomCallout from '../../components/MapViewCustomCallouts/CustomCallout';
import MapView from "react-native-maps";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 3.5;
const CARD_WIDTH = CARD_HEIGHT - 30;
let distance;

class screens extends Component {
  state = {
    region: {
      latitude: 59.911491,
      longitude: 10.757933,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  };
  
  componentWillMount(){
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  
  componentDidMount(){
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) =>{
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.props.cafesInfo.length) {
        index = this.props.cafesInfo.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      
      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() =>{
        if (this.index !== index) {
          this.index = index;
          const { location } = this.props.cafesInfo[index];
          this.map.animateToRegion(
            {
              ...location,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }
  
  render(){
    const interpolations = this.props.cafesInfo.map((marker, index) =>{
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [0.4, 0.5, 0.4],
        extrapolate: "clamp",
      });
      const scaleCard = this.animation.interpolate({
        inputRange,
        outputRange: [1, 1.2, 1],
        extrapolate: "clamp",
      });
      
      return { scale, scaleCard };
    });
    
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={styles.container}
        >
          
          {this.props.cafesInfo.map((marker, index) =>{
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            return (
              <MapView.Marker.Animated key={index} coordinate={marker.location}>
                <Animated.View style={[scaleStyle]}>
                  <Image
                    style={styles.markerImage}
                    source={require('../../assets/icons/ccLogo.png')}
                  />
                </Animated.View>
                  <MapView.Callout
                    onPress={ () => this.props.navigation('details', { item: marker, distance }
                    )}
                    tooltip={false}
                  >
                      <Text numberOfLines={1} style={{ color: '#27313c' }}>{marker.name}</Text>
                  </MapView.Callout>
              </MapView.Marker.Animated>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.props.cafesInfo.map((marker, index) =>{
              if (this.props.userLocation.coords) {
                const { latitude, longitude } = this.props.userLocation.coords;
                distance = calculateDistance(latitude, longitude, marker.location.latitude, marker.location.longitude, "K")
              }
              
              const scaleCardStyle = {
                transform: [
                  {
                    scale: interpolations[index].scaleCard,
                  },
                ],
              };
              return <TouchableOpacity
                activeOpacity={0.5}
                key={index}
                onPress={ () => this.props.navigation('details', { item: marker, distance })}
              >
                <Animated.View style={[styles.card, scaleCardStyle]}>
                  <Image
                    source={{ uri: marker.image }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  >
                    <Text style={{
                      color: '#fff',
                      fontWeight: '500',
                      backgroundColor: 'transparent',
                      position: 'absolute',
                      bottom: 10,
                      right: 10
                    }}>{Math.round((distance * 1000))} m</Text>
                  </Image>
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>{marker.name}</Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>
                      {marker.address}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            }
          )}
        </Animated.ScrollView>
      </View>
    );
  }
}

mapStateToProps = ({ cafes }) =>{
  return {
    cafesInfo: cafes.cafesInfo,
  }
};

export default connect(mapStateToProps, { calculateDistance })(screens);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
});