/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Feather from 'react-native-vector-icons/Feather';
Feather.loadFont();

AppRegistry.registerComponent(appName, () => App);
