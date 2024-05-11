/*/ Production
import 'react-native-gesture-handler';
import MeddlyCamera from './src/MeddlyCamera';
export default MeddlyCamera;
/*/

// Testing
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Example from './src/Example';
AppRegistry.registerComponent(appName, () => Example);
//
