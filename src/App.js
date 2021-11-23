/*/
 * COMPONENT LIFECYCLE
 * CAMERA ACTIONS
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

  componentDidMount() {
    console.log('CAMERA: ', this.camera);

    /* this.startVideo();
    setTimeout(() => {
      this.endVideo();
    }, 1000); */
  }

  /******************** COMPONENT LIFECYCLE ********************/

  /******************** CAMERA ACTIONS ********************/

  startVideo = async () => {
    this.camera.current.startRecording({
      flash: 'on', // ['on', 'off', 'auto']
      fileType: 'mp4',
      onRecordingFinished: video => {
        console.log('REC FINISHED', video);
      },
      onRecordingError: error => {
        console.error('REC ERROR', error);
      },
    });
  };

  endVideo = async () => {
    let res = await this.camera.current.stopRecording();
    console.log('VIDEO STOPPED', res);
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
