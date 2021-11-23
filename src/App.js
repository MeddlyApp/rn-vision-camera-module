/*/
 * COMPONENT LIFECYCLE
 * DEVICE PERMISSIONS
 * COMPONENT RENDERS
/*/

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import VisionCamera from './VisionCamera';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.camera = React.createRef();
  }

  /******************** COMPONENT LIFECYCLE ********************/

  /******************** CAMERA ACTIONS ********************/

  startVideo = async () => {
    this.camera.current.startRecording({
      flash: 'on',
      onRecordingFinished: video => console.log(video),
      onRecordingError: error => console.error(error),
    });
  };

  endVideo = async () => {
    await this.camera.current.stopRecording();
  };

  /******************** COMPONENT RENDERS ********************/

  render() {
    return (
      <SafeAreaView style={styles.base_container}>
        <VisionCamera camera={this.camera} />

        <View style={styles.content_container}>
          <Text style={styles.txt_white}>HELLO</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  base_container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content_container: {
    flex: 1,
    backgroundColor: '#000011',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_white: {
    fontWeight: '700',
    color: '#FFF',
  },
});
