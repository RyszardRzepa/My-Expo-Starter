import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView
} from "react-native";
import { Tile, List, ListItem } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';

const { width, height } = Dimensions.get('window');

export default class realworld extends Component {
  
  renderBackground = (image, address) => {
    return <Tile
      imageSrc={{ uri: image }}
      title={address}
      featured
      caption="Some Caption Text"
    />
  };
  
  renderMenu = () => {
    console.log(this.props.data)
    const list = [
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Vice President'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman'
      },
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Vice President'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman'
      },
    ]
    
    return <ScrollView>
      <View style={{ flex: 1 }}>
        <List containerStyle={{ marginTop: 0, marginBottom: 0, flex: 1 }}>
          {
            list.map((l, i) => (
              <ListItem
                containerStyle={{ width }}
                roundAvatar={false}
                avatarStyle={{ height: 60, width: 60 }}
                avatar={{ uri: l.avatar_url }}
                key={i}
                title={l.name}
              />
            ))
          }
        </List>
      </View>
      </ScrollView>
  };
  
  render () {
    const { image, address } = this.props.data;
    
    return (
      <View style={{ flex: 1 }}>
        {this.renderBackground(image, address)}
        <View style={ styles.contentContainer}>
          {this.renderMenu()}
        </View>
      </View>
    );
  }
}

realworld.defaultProps = {
  image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSvgg44VLOc_bE1c4GN9Do2FR0mP48klnWbfg6aZ_vTPpgO5icLl1AtBP-P',
  address: 'test'
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    flex: 1,
  },
});

