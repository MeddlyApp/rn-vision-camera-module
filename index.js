import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import PlethoraCamera from './src/PlethoraCamera';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => PlethoraCamera);
