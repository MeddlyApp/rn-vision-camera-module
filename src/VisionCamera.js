/*/
 * COMPONENT LIFECYCLE
 * PERMISSIONS
 * HTTP REQUESTS
 * EVENT ACTIONS
 * GESTURE CONTROLS
 * CAMERA ACTIONS
 * CAMERA LIFECYCLE
 * COMPONENT RENDERS
/*/

import React, {Component, Fragment} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Linking,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RenderCamera from './RenderCamera';
import styles from './styles';

export default class VisionCamera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Camera Settings
      camera_active: false,
      front_camera: false,
      flash: 'off',
      is_video: true,
      is_recording: false,

      // Permission Denied
      camera_permission_denied: false,
      microphone_permission_denied: false,

      // Permission Granted
      has_camera_permission: false,
      has_microphone_permission: false,
    };

    this.camera = React.createRef();
  }

  /******************** COMPONENT LIFECYCLE ********************/

  componentDidMount = async () => {
    await this.checkPermissions();

    let {has_camera_permission, has_microphone_permission} = this.state;
    let has_permission = has_camera_permission && has_microphone_permission;
    if (has_permission) this.setState({camera_active: true});
  };

  componentWillUnmount() {
    this.setState({camera_active: false});
  }

  /******************** PERMISSIONS ********************/

  checkPermissions = async () => {
    await this.getCameraPermissions();
    await this.getMicrophonePermissions();
    await this.getCameraRollPermissions();
  };

  getCameraPermissions = async () => {
    let permission = PermissionsAndroid.PERMISSIONS.CAMERA;
    let hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return this.setState({has_camera_permission: true});
    let status = await PermissionsAndroid.request(permission);
    if (status === 'granted') {
      this.setState({has_camera_permission: true});
    }
    if (status === 'never_ask_again') {
      this.setState({camera_permission_denied: true});
    }
  };

  getMicrophonePermissions = async () => {
    let permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    let hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return this.setState({has_microphone_permission: true});
    let status = await PermissionsAndroid.request(permission);
    if (status === 'granted') {
      this.setState({has_microphone_permission: true});
    }
    if (status === 'never_ask_again') {
      this.setState({microphone_permission_denied: true});
    }
    return status;
  };

  getCameraRollPermissions = async () => {
    let permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    let hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return true;
    let status = await PermissionsAndroid.request(permission);
    return status === 'authorized';
  };

  openSettings = async () => await Linking.openSettings();

  /******************** HTTP REQUESTS ********************/

  /******************** EVENT ACTIONS ********************/

  /******************** GESTURE CONTROLS ********************/

  tapToFocus = async e => {
    await this.camera.current.focus({
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    });
  };

  onSingleTap = e => alert("I'm touched");
  onDoubleTap = e => alert('Double tap, good job!');

  /******************** CAMERA ACTIONS ********************/

  toggleCamera = () => {
    let {front_camera} = this.state;
    this.setState({front_camera: !front_camera});
  };

  toggleFlash = () => {
    let {flash} = this.state;
    switch (flash) {
      case 'off':
        return this.setState({flash: 'on'});
      case 'on':
        return this.setState({flash: 'auto'});
      case 'auto':
        return this.setState({flash: 'off'});
      default:
        return this.setState({flash: 'off'});
    }
  };

  /******************** CAMERA LIFECYCLE ********************/

  startVideo = async () => {
    console.log('Started Video');
    let {flash} = this.state;
    this.camera.current.startRecording({
      flash: flash,
      fileType: 'mp4',
      onRecordingFinished: async video => {
        console.log('Recording Finished', video);
        let no_permissions =
          Platform.OS === 'android' && !(await this.getCameraRollPermissions());

        if (no_permissions) return alert('Camera Roll not permitted');

        CameraRoll.save(video.path);
      },
      onRecordingError: error => {
        console.error('REC ERROR', error);
      },
    });
    this.setState({is_recording: true});
  };

  endVideo = async () => {
    console.log('Ending Video');
    let res = await this.camera.current.stopRecording();
    this.setState({is_recording: false});
    console.log('VIDEO STOPPED', res);
  };

  /******************** COMPONENT RENDERS ********************/

  renderMissingPermissions = () => {
    let {has_camera_permission, has_microphone_permission} = this.state;
    return (
      <TouchableOpacity
        onPress={this.openSettings}
        style={styles.permissions_content_container}>
        {!has_camera_permission ? (
          <Text style={styles.txt_white}>Camera Permission Denied</Text>
        ) : null}

        {!has_microphone_permission ? (
          <Text style={styles.txt_white}>Microphone Permission Denied</Text>
        ) : null}

        <Text style={styles.txt_white_margin_top}>Open Settings</Text>
      </TouchableOpacity>
    );
  };

  renderRecordingControls = () => {
    let {is_recording} = this.state;

    if (!is_recording) {
      return (
        <TouchableOpacity onPress={this.startVideo} style={styles.rec_btn}>
          <Text style={styles.txt_white}>Record</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={this.endVideo} style={styles.stop_btn}>
          <Text style={styles.txt_white}>Stop</Text>
        </TouchableOpacity>
      );
    }
  };

  renderCameraControls = () => {
    let {front_camera, flash} = this.state;
    let cameraView = front_camera ? 'Front' : 'Back';

    return (
      <Fragment>
        <TouchableOpacity onPress={this.toggleCamera} style={styles.toggle_btn}>
          <Text style={styles.txt_white}>Camera: {cameraView}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.toggleFlash} style={styles.toggle_btn}>
          <Text style={styles.txt_white}>Flash: {flash}</Text>
        </TouchableOpacity>
      </Fragment>
    );
  };

  renderCameraComponents = () => {
    let {camera_active, front_camera, is_video, is_recording} = this.state;

    return (
      <Fragment>
        <RenderCamera
          camera={this.camera}
          camera_active={camera_active}
          front_camera={front_camera}
          is_video={is_video}
        />

        <View style={styles.vert_content_container}>
          <View style={styles.vert_row_top}>
            <Text style={styles.txt_white}>Select Event Goes Here</Text>
          </View>

          <View style={styles.vert_row_middle_top}>
            {!is_recording ? this.renderCameraControls() : null}
          </View>

          <View style={styles.vert_row_middle_bottom}>
            {this.renderRecordingControls()}
          </View>

          <View style={styles.vert_row_bottom} />
        </View>
      </Fragment>
    );
  };

  render() {
    let {has_camera_permission, has_microphone_permission} = this.state;
    let has_permission = has_camera_permission && has_microphone_permission;

    return (
      <SafeAreaView style={styles.base_container}>
        {has_permission
          ? this.renderCameraComponents()
          : this.renderMissingPermissions()}
      </SafeAreaView>
    );
  }
}
