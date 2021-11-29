/*/
 * COMPONENT LIFECYCLE
 * PERMISSIONS
 * HTTP REQUESTS
 * CAMERA ACTIONS
 * COMPONENT RENDERS
 * STYLES
/*/

import React, {Component, Fragment} from 'react';
import {SafeAreaView, StyleSheet, Linking, View, Text} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import RenderCamera from './RenderCamera';

export default class VisionCamera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      front_camera: false,
      flash: false,
      has_permission_cam: false,
      has_permission_mic: false,
    };

    this.camera = React.createRef();
  }

  componentDidMount() {
    this.checkPermissions();
  }

  /******************** COMPONENT LIFECYCLE ********************/

  /******************** PERMISSIONS ********************/

  checkPermissions = async () => {
    await this.getCameraPermissions();
    await this.getMicrophonePermissions();
  };
  getCameraPermissions = async () => {
    await Camera.getCameraPermissionStatus().then(async res => {
      if (res === 'not-determined') await Camera.requestCameraPermission();
      if (res === 'denied') await this.openSettings();
      if (res === 'authorized') this.setState({has_permission_cam: true});
    });
  };
  getMicrophonePermissions = async () => {
    await Camera.getMicrophonePermissionStatus().then(async res => {
      if (res === 'not-determined') await Camera.requestMicrophonePermission();
      if (res === 'denied') console.log('Bingo2');
      if (res === 'authorized') this.setState({has_permission_mic: true});
    });
  };
  openSettings = async () => {
    await Linking.openSettings();
  };

  /******************** HTTP REQUESTS ********************/

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

  renderMissingPermissions = () => {
    return (
      <View style={styles.content_container}>
        <Text style={styles.txt_white}>Hi</Text>
      </View>
    );
  };
  renderCameraComponents = () => {
    return (
      <Fragment>
        <RenderCamera state={this.state} camera={this.camera} />
      </Fragment>
    );
  };

  render() {
    let {has_permission_cam, has_permission_mic} = this.state;
    return (
      <SafeAreaView style={styles.base_container}>
        {has_permission_cam && has_permission_mic
          ? this.renderCameraComponents()
          : this.renderMissingPermissions()}
      </SafeAreaView>
    );
  }
}

/******************** STYLES ********************/

const styles = StyleSheet.create({
  base_container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_white: {
    fontWeight: '700',
    color: '#FFF',
  },
});
