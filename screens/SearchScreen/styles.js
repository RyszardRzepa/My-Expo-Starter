import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = {
  buttonContainer: {
    height: height * 0.08,
    backgroundColor: '#51ade8',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default styles;