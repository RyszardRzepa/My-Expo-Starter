import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => {
  const { viewStyle } = styles;
  
  return (
    <View style={viewStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: '#008CCA',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    elevation: 3,
    position: 'relative',
  },
};

// Make the component available to other parts of the app
export default  Header ;