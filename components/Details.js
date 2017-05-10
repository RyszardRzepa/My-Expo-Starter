import React, { Component } from "react";
import {
  View,
  Dimensions,
  ScrollView
} from "react-native";
import { Tile, List, ListItem } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';

import styles from './styles/details';

const { width, height } = Dimensions.get('window');

export default class Details extends Component {
  
  renderBackground = (image, address) => {
    return <Tile
      imageSrc={{ uri: image }}
      title={address}
      featured
      caption="Some Caption Text"
    />
  };
  
  _renderHeader (coffee) {
    return (
      <View style={styles.header}>
        <View style={styles.content}>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <List containerStyle={styles.listStyle }>
                <ListItem
                  containerStyle={{ width }}
                  roundAvatar={false}
                  avatarStyle={styles.avatarStyle}
                  avatar={{ uri: coffee.image }}
                  key={coffee.name}
                  title={coffee.name}
                />
              </List>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
  
  _renderContent ({ price, size }) {
    const priceMedium = price.medium;
    const sizeMedium = size.medium;
    
    const priceSmall = price.small;
    const sizeSmall = size.small;
    
    return (
      <View>
        <List containerStyle={ styles.listStyle }>
          <ListItem
            rightIcon={{ name: 'add-box' }}
            key={priceMedium}
            title={priceMedium}
            subtitle={sizeMedium}
          />
          <ListItem
            rightIcon={{ name: 'add-box' }}
            key={priceSmall}
            title={priceSmall}
            subtitle={sizeSmall}
          />
        </List>
      </View>
    );
  }
  
  render () {
    const { image, address } = this.props.data;
    
    return (
      <View style={{ flex: 1 }}>
        {this.renderBackground(image, address)}
        <Accordion
          sections={this.props.data.menu}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
        />
      </View>
    );
  }
}

Details.defaultProps = {
  image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSvgg44VLOc_bE1c4GN9Do2FR0mP48klnWbfg6aZ_vTPpgO5icLl1AtBP-P',
  address: 'Test address',
  data: {}
};



