import React, { Component, PropTypes } from 'react';
import { FlatList, TouchableWithoutFeedback, View, Text, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';

class LibraryList extends Component {
  componentWillUpdate () {
    LayoutAnimation.spring();
  }
  
  constructor (props) {
    super(props);
    
    this.state = {
      drinkName: ''
    }
  }
  
  selectLibrary = async (item) => {
    await this.setState({
      drinkName: item.name,
    })
  };
  
  renderRow = ({ item }) => {
    
    return <View>
      <TouchableWithoutFeedback
        onPress={() => {
          this.selectLibrary(item);
          this.renderDescription(item)
        }}
      >
        <View>
          <Text style={styles.titleStyle}>
            {item.name}
          </Text>
          {this.renderDescription(item)}
        </View>
      </TouchableWithoutFeedback>
    </View>
  };
  
  renderDescription (item) {
    if (this.state.drinkName === item.name) {
      return (
        <Text style={{ flex: 1 }}>
          {item.name}
        </Text>
      );
    }
  }
  
  render () {
    return (
      <FlatList
        renderItem={this.renderRow}
        data={this.props.data.menu}
        keyExtractor={ (item) => item.name}
      />
    );
  }
}

LibraryList.propType = {
  data: PropTypes.object
};

export default connect(null)(LibraryList);