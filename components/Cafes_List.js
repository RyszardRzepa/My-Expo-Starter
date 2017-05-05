import React, { Component } from "react";
import { Image, View, Dimensions, Text, FlatList } from "react-native";
import { Card, Button } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

class CafesList extends Component {
  state = {
    loading: false,
    refreshing: false,
  };
  
  renderItem (item) {
    return (
      <View>
        <Card
          title={item.address}
          image={{ uri: item.image }}>
        </Card>
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