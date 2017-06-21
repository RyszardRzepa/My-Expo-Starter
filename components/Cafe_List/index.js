import React, { Component, PropTypes } from "react";
import { View, Dimensions, Text, FlatList, Platform } from "react-native";
import { Divider, Tile, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import calculateDistance from '../../services/calculateDistance';

const { width, height } = Dimensions.get('window');

class CafesList extends Component {
  state = {
    isLoading: false,
    refreshing: false,
  };
  
  renderItem (item) {
    const { latitude, longitude } = this.props.userLocation.coords;
    let distance = calculateDistance(
      latitude, longitude, item.location.latitude, item.location.longitude, "K"
    );
    
    return (
      <View>
        <View>
          <Tile
            onPress={() => this.props.navigation('details', { item, distance })}
            imageSrc={{ uri: item.image }}
            title={item.name}
            featured
            caption={item.address}
            height={220}
            activeOpacity={0.5}
            imageContainerStyle={{ backgroundColor: '#d9dade' }}
            containerStyle={{ position: 'relative' }}
          />
        </View>
        <View style={{ alignItems: 'center', position: 'absolute', right: 20, bottom: 20, flexDirection: 'row', }}>
          <Icon
            name="place"
            size={30}
            color="#fff"
          />
          <Text style={{ fontSize: 20, backgroundColor: 'transparent', color: '#fff' }}> {Math.round(distance * 1000)}
            m</Text>
        </View>
        <Divider style={{ backgroundColor: '#fff' }}/>
      </View>
    )
  }
  
  render () {
    console.log("props from Cafelist", this.props.userLocation)
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          removeClippedSubviews={false}
          keyExtractor={item => item.location.latitude}
          data={this.props.data}
          renderItem={({ item }) => this.renderItem(item)}
        />
      </View>
    )
  }
}

CafesListPropTypes = {
  data: PropTypes.array
};

mapStateToProps = ({ cafes }) => {
  return { isLoading: cafes.isLoading }
};
export default connect(mapStateToProps)(CafesList);