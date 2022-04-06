/*/ Production
import 'react-native-gesture-handler';
import PlethoraCamera from './src/PlethoraCamera';
export default PlethoraCamera;
/*/

// Testing
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Example from './src/Example';
AppRegistry.registerComponent(appName, () => Example);
