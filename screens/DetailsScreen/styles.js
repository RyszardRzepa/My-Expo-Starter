import { Platform } from 'react-native';

const styles = {
  credits: {
    fontSize: 22,
    fontWeight: '400',
    color: '#ffffff',
    marginRight: 10,
    marginLeft: 5
  },
  headerCredits: { flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? 10 : 0, marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default styles;