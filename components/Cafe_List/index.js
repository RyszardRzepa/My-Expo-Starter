import React, { Component } from "react";
import { View, Dimensions, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Divider, Tile, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import Hero from 'react-native-hero';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

class CafesList extends Component {
  state = {
    loading: false,
    refreshing: false,
  };
  
  renderItem (item) {
    return (
      <View>
        {/*<TouchableOpacity onPress={() => this.props.navigation('details', item)}>*/}
        {/*<Hero*/}
        {/*source={{ uri: item.image }}*/}
        {/*renderOverlay={() => this.overlay()}*/}
        {/*fullWidth={true}*/}
        {/*minHeight={150}*/}
        {/*colorOverlay="#1bb4d8"*/}
        {/*colorOpacity={0.2}*/}
        {/*/>*/}
        {/*</TouchableOpacity>*/}
        <Tile
          onPress={() => this.props.navigation('details', item)}
          imageSrc={{ uri: item.image }}
          title={item.address}
          featured
          caption="Some Caption Text"
          contentContainerStyle={{ height: 200 }}
        />
        <Divider style={{ backgroundColor: '#fff' }}/>
      </View>
    )
  }
  
  render () {
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
mapStateToProps = ({ cafes }) => {
  return { isLoading: cafes.isLoading }
};
export default connect(mapStateToProps)(CafesList);