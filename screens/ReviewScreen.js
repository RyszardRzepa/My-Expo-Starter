import React, { Component } from 'react';
import { View, Text, Platform, ScrollView } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

class ReviewScreen extends Component {
  static navigationOptions = {
    title: 'Review Jobs',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="favorite" size={30} color={tintColor}/>;
      
    },
    headerRight: ({ navigate }) => {
      return <Button
        style={{
          marginTop: Platform.OS === 'android' ? 24 : 0
        }}
        title="Settings"
        onPress={() => navigate('settings')}
        backgroundColor="rgba(0,0,0,0)"
        color="rgba(0, 122, 255, 1)"
      />
    }
  }
  
  render () {
    return (
      <ScrollView>
        <View>
          <Text>
            Reciew screen
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default connect(null)(ReviewScreen);
