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
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RenderCamera from './RenderCamera';
import styles from './styles';
import GestureHandler from './GestureHandler';

export default class VisionCamera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen_size: Dimensions.get('window'),

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
    this.doubleTapRef = React.createRef();
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
    await this.camera.current
      .focus({
        x: e.nativeEvent.absoluteX,
        y: e.nativeEvent.absoluteY,
      })
      .catch(e => console.log('Focus Error: ', e));
  };

  deviceRotated = () => {
    let size = Dimensions.get('window');
    this.setState({screen_size: size});
    console.log('Updated Size: ', size);
  };

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
    let timestamp1 = new Date().getTime();
    console.log('Starting Video', timestamp1);
    let {flash} = this.state;
    await this.camera.current.startRecording({
      flash: flash,
      fileType: 'mp4',
      onRecordingFinished: async video => {
        console.log('Recording Finished', video);
        console.log('Video Start Timestamp => To Record', timestamp2);

        // Send payload to API call
        let payload = {
          timestamp_start: timestamp2,
          data: video.path,
        };
        // - this.props.saveVideo(payload)

        // Check Android permissions then save to Camera Roll
        if (
          Platform.OS === 'android' &&
          !(await this.getCameraRollPermissions())
        ) {
          return alert('Camera Roll not permitted');
        }

        CameraRoll.save(video.path);
      },
      onRecordingError: error => {
        console.error('REC ERROR', error);
      },
    });

    let timestamp2 = new Date().getTime();
    console.log('Video Started', timestamp2);

    this.setState({is_recording: true});
  };

  endVideo = async () => {
    let timestamp1 = new Date().getTime();
    console.log('Ending Video', timestamp1);
    await this.camera.current.stopRecording();
    let timestamp2 = new Date().getTime();
    console.log('Video Stopped', timestamp2);
    return this.setState({is_recording: false});
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
    let {screen_size, front_camera, flash} = this.state;
    let cameraView = front_camera ? 'Front' : 'Back';
    let is_vertical = screen_size.height > screen_size.width;

    let vertical_styles = {
      height: 80,
      width: screen_size.width / 2,
      alignItems: 'center',
      justifyContent: 'center',
    };
    let horizontal_styles = {
      width: 80,
      height: screen_size.height / 2,
      alignItems: 'center',
      justifyContent: 'center',
    };

    let toggle_btn_style = is_vertical ? vertical_styles : horizontal_styles;

    return (
      <Fragment>
        <View style={toggle_btn_style}>
          <TouchableOpacity
            onPress={this.toggleCamera}
            style={styles.camera_btn}>
            <Text style={styles.txt_white}>{cameraView}</Text>
          </TouchableOpacity>
        </View>

        <View style={toggle_btn_style}>
          <TouchableOpacity
            onPress={this.toggleFlash}
            style={styles.camera_btn}>
            <Text style={styles.txt_white}>{flash}</Text>
          </TouchableOpacity>
        </View>
      </Fragment>
    );
  };

  renderHorizontalCameraControls = () => {
    let {is_recording, screen_size} = this.state;
    let is_vertical = screen_size.height > screen_size.width;

    let camera_controls_container_styles = {
      width: 80,
      height: window.height,
      flexDirection: 'column',
      // backgroundColor: 'purple',
    };

    return (
      <View style={styles.horizontal_content_container}>
        <View style={styles.horizontal_row_select_event}>
          <Text style={styles.txt_white}>Event_Ctl</Text>
        </View>

        <View style={styles.horizontal_gesture_controls}>
          <GestureHandler
            is_vertical={is_vertical}
            doubleTapRef={this.doubleTapRef}
            onSingleTap={this.tapToFocus}
            onDoubleTap={this.toggleCamera}>
            <Text style={styles.txt_white}>Gesture Section</Text>
          </GestureHandler>
        </View>

        <View style={camera_controls_container_styles}>
          {!is_recording ? this.renderCameraControls() : null}
        </View>

        <View style={styles.horizontal_row_recording_controls}>
          {this.renderRecordingControls()}
        </View>

        <View style={styles.horizontal_bottom_void} />
      </View>
    );
  };

  renderVerticalCameraControls = () => {
    let {is_recording, screen_size} = this.state;
    let is_vertical = screen_size.height > screen_size.width;

    let camera_controls_container_styles = {
      height: 80,
      width: window.width,
      flexDirection: 'row',
      // backgroundColor: 'purple',
    };

    return (
      <View style={styles.vertical_content_container}>
        <View style={styles.vertical_row_select_event}>
          <Text style={styles.txt_white}>Event_Ctl</Text>
        </View>

        <View style={styles.vertical_gesture_controls}>
          <GestureHandler
            is_vertical={is_vertical}
            doubleTapRef={this.doubleTapRef}
            onSingleTap={this.tapToFocus}
            onDoubleTap={this.toggleCamera}>
            <Text style={styles.txt_white}>Gesture Section</Text>
          </GestureHandler>
        </View>

        <View style={camera_controls_container_styles}>
          {!is_recording ? this.renderCameraControls() : null}
        </View>

        <View style={styles.vertical_row_recording_controls}>
          {this.renderRecordingControls()}
        </View>

        <View style={styles.vertical_bottom_void} />
      </View>
    );
  };

  renderCameraLayout = () => {
    let {screen_size, camera_active, front_camera, is_video} = this.state;

    return (
      <Fragment>
        <RenderCamera
          camera={this.camera}
          camera_active={camera_active}
          front_camera={front_camera}
          is_video={is_video}
        />

        {screen_size.height > screen_size.width
          ? this.renderVerticalCameraControls()
          : this.renderHorizontalCameraControls()}
      </Fragment>
    );
  };

  render() {
    let {has_camera_permission, has_microphone_permission} = this.state;
    let has_permission = has_camera_permission && has_microphone_permission;

    return (
      <SafeAreaView style={styles.base_container} onLayout={this.deviceRotated}>
        {has_permission
          ? this.renderCameraLayout()
          : this.renderMissingPermissions()}
      </SafeAreaView>
    );
  }
}
