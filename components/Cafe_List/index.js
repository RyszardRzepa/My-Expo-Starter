import React, { Component, PropTypes } from "react";
import { View, Dimensions, Text, FlatList } from "react-native";
import { Divider, Tile, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

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

CafesList.propTypes = {
  isLoading: PropTypes.boolean,
  data: PropTypes.array
};

mapStateToProps = ({ cafes }) => {
  return { isLoading: cafes.isLoading }
};
export default connect(mapStateToProps)(CafesList);