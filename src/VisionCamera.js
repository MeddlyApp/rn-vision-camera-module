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
      zoom: 0,

      // Permission Denied
      camera_permission_denied: false,
      microphone_permission_denied: false,

      // Permission Granted
      has_camera_permission: false,
      has_microphone_permission: false,
    };

    this.camera = React.createRef();

    this.pinchRef = React.createRef();
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
    console.log('TAP TO FOCUS');
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

  onPinchStart = () => (this._prevPinch = 1);
  onPinchEnd = () => (this._prevPinch = 1);
  onPinchProgress = p => {
    let {zoom} = this.state;
    let zoom_value = 0.01;
    let p2 = p - this._prevPinch;

    if (p2 > 0 && p2 > zoom_value) {
      this._prevPinch = p;
      this.setState({zoom: Math.min(zoom + zoom_value, 1)}, () => {});
    } else if (p2 < 0 && p2 < -zoom_value) {
      this._prevPinch = p;
      this.setState({zoom: Math.max(zoom - zoom_value, 0)}, () => {});
    }
  };

  /******************** CAMERA ACTIONS ********************/

  toggleCamera = () => {
    console.log('TOGGLE CAMERA');

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
      height: screen_size.height,
      flexDirection: 'column',
    };
    let horizontal_content_container = {
      width: screen_size.width,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    return (
      <View style={horizontal_content_container}>
        <View style={styles.horizontal_row_select_event}>
          <Text style={styles.txt_white}>Event_Ctl</Text>
        </View>

        <View style={styles.horizontal_gesture_controls}></View>

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
    };
    let vertical_content_container = {
      height: screen_size.height,
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <View style={vertical_content_container}>
        <View style={styles.vertical_row_select_event}>
          <Text style={styles.txt_white}>Event_Ctl</Text>
        </View>

        <View style={styles.vertical_gesture_controls}></View>

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
    let {screen_size, camera_active, front_camera, is_video, zoom} = this.state;
    let is_vertical = screen_size.height > screen_size.width;

    return (
      <Fragment>
        <RenderCamera
          camera={this.camera}
          camera_active={camera_active}
          front_camera={front_camera}
          is_video={is_video}
          zoom={zoom}
        />

        <GestureHandler
          pinchRef={this.pinchRef}
          doubleTapRef={this.doubleTapRef}
          onSingleTap={this.tapToFocus}
          onDoubleTap={this.toggleCamera}
          onPinchProgress={this.onPinchProgress}
          onPinchStart={this.onPinchStart}
          onPinchEnd={this.onPinchEnd}>
          {is_vertical
            ? this.renderVerticalCameraControls()
            : this.renderHorizontalCameraControls()}
        </GestureHandler>
      </Fragment>
    );
  };

  render() {
    let {has_camera_permission, has_microphone_permission} = this.state;
    let has_permissions = has_camera_permission && has_microphone_permission;

    return (
      <SafeAreaView style={styles.base_container} onLayout={this.deviceRotated}>
        {has_permissions
          ? this.renderCameraLayout()
          : this.renderMissingPermissions()}
      </SafeAreaView>
    );
  }
}
