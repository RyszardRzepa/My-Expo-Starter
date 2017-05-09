import React, { Component } from "react";
import { View, Dimensions, Text, FlatList } from "react-native";
import { Divider, Tile } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

class CafesList extends Component {
  state = {
    loading: false,
    refreshing: false,
  };
  
  renderItem (item) {
    return (
      <View>
        <Tile
          onPress={() => this.props.navigation('details', item)}
          imageSrc={{ uri: item.image}}
          title={item.address}
          featured
          caption="Some Caption Text"
        />
        <Divider style={{ backgroundColor: '#fff' }} />
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

export default CafesList;