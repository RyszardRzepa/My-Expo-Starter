import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

const styles = {
  modal: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: height * 0.8
  },
  icon: {
    position: "absolute",
    bottom: 100,
    right: 50,
    width: 50,
    height: 50,
    backgroundColor: 'transparent'
  },
};

export default styles;