import React, { Component, PropTypes } from "react";
import { View, Dimensions, Text, FlatList, TextInput, Platform } from "react-native";
import { Divider, Tile, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import calculateDistance from '../../services/calculateDistance';

const { width, height } = Dimensions.get('window');

class CafesList extends Component {
  state = {
    isLoading: false,
    refreshing: false,
    text: ''
  };
  
  componentWillUpdate (nextProps, nextState) {
    if (nextState.text !== this.state.text) {
      this.props.searchCafes(nextState.text)
    }
  }
  
  renderItem (item) {
    const { latitude, longitude } = this.props.userLocation.coords || {};
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
            height={150}
            activeOpacity={0.5}
            imageContainerStyle={{ backgroundColor: '#6fdbff' }}
            containerStyle={{ position: 'relative' }}
            overlayContainerStyle={{ backgroundColor: ' rgba(0, 0, 0, 0.35)' }}
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
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#eeeeee',  margin: 5,  borderRadius: 5, flexDirection: 'row' }}>
          <Icon containerStyle={{ height: 40, marginLeft: 5 }} name="search" color="grey" size={20}/>
          <TextInput
            underlineColorAndroid='transparent'
            placeholder='Search for cafe'
            style={{ backgroundColor: '#eeeeee',  borderRadius: 5, flex: 4, textAlign: 'center' }}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
        </View>
        <FlatList
          removeClippedSubviews={false}
          keyExtractor={item => item.location.latitude}
          data={this.props.cafeInfo || this.props.data}
          renderItem={({ item }) => this.renderItem(item)}
        />
      </View>
    )
  }
}

CafesListPropTypes = {
  data: PropTypes.array
};

mapStateToProps = ({ cafes, search }) => {
  return {
    isLoading: cafes.isLoading,
    cafeInfo: search.cafeInfoSearch
  }
};
export default connect(mapStateToProps)(CafesList);