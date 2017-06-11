import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => {
  const { textStyle, viewStyle, textRight } = styles;
  
  return (
    <View style={viewStyle}>
      <View>{props.iconLeft}</View>
      <Text style={textStyle}>{props.headerText}</Text>
      <Text style={textRight}>{props.textRight} NOK</Text>
    </View>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: '#59bcfe',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  textRight: {
    fontSize: 18,
    color: '#484848',
    marginRight: 10,
  },
  textStyle: {
    fontSize: 20,
    color: '#fff'
  }
};

// Make the component available to other parts of the app
export default  Header ;