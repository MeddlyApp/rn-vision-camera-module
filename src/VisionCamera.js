/*/
 * COMPONENT LIFECYCLE
 * PERMISSIONS
 * HTTP REQUESTS
 * EVENT ACTIONS
 * GESTURE CONTROLS
 * CAMERA ACTIONS
 * VIDEO CAMERA LIFECYCLE
 * PICTURE LIFECYCLE
 * RENDERS
/*/

import React, {Component} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Linking,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import Orientation from 'react-native-orientation-locker';
import styles from './styles';
import GestureHandler from './Components/GestureHandler';
import RenderCamera from './Components/RenderCamera';
import MissingPermissions from './Components/MissingPermissions';
import CameraControlsHorizontal from './Components/CameraControlsHorizontal';
import CameraControlsVertical from './Components/CameraControlsVertical';
import VideoControls from './Components/VideoControls';
import PictureControls from './Components/PictureControls';

export default class VisionCamera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen_size: Dimensions.get('window'),
      orientation: 'PORTRAIT',
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
    Orientation.addOrientationListener(this.onOrientationDidChange);
    await this.checkPermissions();

    let {has_camera_permission, has_microphone_permission} = this.state;
    let has_permission = has_camera_permission && has_microphone_permission;
    if (has_permission) this.setState({camera_active: true});
  };

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.onOrientationDidChange);
    this.setState({camera_active: false});
  }

  /******************** PERMISSIONS ********************/

  checkPermissions = async () => {
    if (Platform.OS === 'android') {
      await Promise.all([
        this.getCameraPermissions(),
        this.getMicrophonePermissions(),
        this.getCameraRollPermissions(),
      ]);
    }
    if (Platform.OS === 'ios') {
      this.setState({
        has_camera_permission: true,
        has_microphone_permission: true,
      });
    }
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

  onOrientationDidChange = orientation => this.setState({orientation});
  deviceRotated = () => this.setState({screen_size: Dimensions.get('window')});

  tapToFocus = async e => {
    await this.camera.current
      .focus({x: e.nativeEvent.absoluteX, y: e.nativeEvent.absoluteY})
      .catch(e => console.log('Focus Error: ', e));
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
      this.setState({zoom: Math.max(zoom - zoom_value * 1.5, 0)}, () => {});
    }
  };

  /******************** CAMERA ACTIONS ********************/

  toggleCamera = () => {
    let {front_camera} = this.state;
    this.setState({
      front_camera: !front_camera,
      zoom: 0,
    });
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
  toggleVideoOrPicture = () => this.setState({is_video: !this.state.is_video});

  /******************** VIDEO CAMERA LIFECYCLE ********************/

  lockOrientation = async () => {
    new Promise(resolve => {
      let {orientation} = this.state;
      switch (orientation) {
        case 'PORTRAIT':
          return resolve(Orientation.lockToPortrait());
        case 'LANDSCAPE-LEFT':
          return resolve(Orientation.lockToLandscapeLeft());
        case 'LANDSCAPE-RIGHT':
          return resolve(Orientation.lockToLandscapeRight());
        default:
          return resolve(console.log('Lock Orientation Error'));
      }
    });
  };
  startVideo = async () => {
    let timestamp1 = new Date().getTime();
    console.log('Starting Video', timestamp1);
    let {flash} = this.state;

    await this.lockOrientation();
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

        // Unlock Orientations
        Orientation.unlockAllOrientations();
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

  /******************** PICTURE LIFECYCLE ********************/
  takePicture = () => {
    alert();
  };

  /******************** RENDERS ********************/

  render() {
    let {
      has_camera_permission,
      has_microphone_permission,
      screen_size,
      camera_active,
      front_camera,
      zoom,
      is_recording,
      is_video,
    } = this.state;
    let has_permissions = has_camera_permission && has_microphone_permission;
    let is_vertical = screen_size.height > screen_size.width;

    return (
      <SafeAreaView style={styles.base_container} onLayout={this.deviceRotated}>
        <StatusBar hidden={true} />

        {has_permissions ? (
          <>
            <RenderCamera
              camera={this.camera}
              camera_active={camera_active}
              front_camera={front_camera}
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
              <View>
                {is_vertical ? (
                  <CameraControlsVertical
                    state={this.state}
                    toggleCamera={this.toggleCamera}
                    toggleFlash={this.toggleFlash}>
                    {is_video ? (
                      <VideoControls
                        is_recording={is_recording}
                        startVideo={this.startVideo}
                        endVideo={this.endVideo}
                      />
                    ) : (
                      <PictureControls takePicture={this.takePicture} />
                    )}
                  </CameraControlsVertical>
                ) : (
                  <CameraControlsHorizontal
                    state={this.state}
                    toggleCamera={this.toggleCamera}
                    toggleFlash={this.toggleFlash}>
                    {is_video ? (
                      <VideoControls
                        is_recording={is_recording}
                        startVideo={this.startVideo}
                        endVideo={this.endVideo}
                      />
                    ) : (
                      <PictureControls takePicture={this.takePicture} />
                    )}
                  </CameraControlsHorizontal>
                )}
              </View>
            </GestureHandler>
          </>
        ) : (
          <MissingPermissions
            has_camera_permission={this.state.has_camera_permission}
            has_microphone_permission={this.state.has_microphone_permission}
            openSettings={this.openSettings}
          />
        )}
      </SafeAreaView>
    );
  }
}
