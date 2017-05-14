import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'
console.tron = Reactotron;
Reactotron
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!
  .use(reactotronRedux())
  