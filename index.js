import 'react-native-gesture-handler';
import PlethoraCamera from './src/PlethoraCamera';

export default function Camera(props) {
  return <PlethoraCamera {...props} />;
}

/*
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import PlethoraCamera from './src/PlethoraCamera';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => PlethoraCamera);
*/
