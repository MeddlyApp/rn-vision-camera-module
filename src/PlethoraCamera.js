/*/
 * COMPONENT LIFECYCLE
 * PERMISSIONS
 * GESTURE CONTROLS
 * CAMERA ACTIONS
 * VIDEO CAMERA LIFECYCLE
 * PICTURE LIFECYCLE
 * RENDERS
/*/

import React, {Component} from 'react';
import {
  LogBox,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Linking,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
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
import renameFile from '../utilities/RenameFile';
import UploadHTTP from '../utilities/http/UploadHTTP';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

export default class PlethoraCamera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_video: true,
      screen_size: Dimensions.get('window'),
      orientation: 'PORTRAIT',
      // Camera Settings
      camera_active: false,
      front_camera: false,
      zoom: 0,
      flash: 'off',
      is_recording: false,
      video_start_time: null,
      // Permissions
      has_camera_permission: false,
      has_microphone_permission: false,
      has_camera_roll_permission: false,
    };

    this.camera = React.createRef();
    this.pinchRef = React.createRef();
    this.doubleTapRef = React.createRef();
  }

  /******************** COMPONENT LIFECYCLE ********************/

  componentDidMount = async () => {
    await this.checkPermissions();

    const {
      has_camera_permission,
      has_microphone_permission,
      has_camera_roll_permission,
    } = this.state;

    const has_permission =
      has_camera_permission &&
      has_microphone_permission &&
      has_camera_roll_permission;

    if (has_permission) this.setState({camera_active: true});

    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(this.onOrientationDidChange);
  };

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.onOrientationDidChange);
    this.setState({camera_active: false});
  }

  /******************** PERMISSIONS ********************/

  checkPermissions = async () => {
    const has_cam_roll = await this.getCameraRollPermissions();
    const has_camera = await this.getCameraPermissions();
    const has_mic = await this.getMicrophonePermissions();

    this.setState({
      has_camera_permission: has_camera,
      has_microphone_permission: has_mic,
      has_camera_roll_permission: has_cam_roll,
    });
  };

  getCameraPermissions = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission === 'authorized') return true;
    if (
      cameraPermission === 'not-determined' ||
      cameraPermission === 'denied'
    ) {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission === 'authorized') return true;
      return false;
    } else return false;
  };

  getMicrophonePermissions = async () => {
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    if (microphonePermission === 'authorized') return true;
    if (
      microphonePermission === 'not-determined' ||
      microphonePermission === 'denied'
    ) {
      const newMicrophonePermission =
        await Camera.requestMicrophonePermission();
      if (newMicrophonePermission === 'authorized') return true;
      return false;
    } else return false;
  };

  getCameraRollPermissions = async () => {
    if (Platform.OS === 'android') {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) return true;
      else {
        const status = await PermissionsAndroid.request(permission);
        console.log('CAMERA_STORAGE: ', status);
        return status === 'authorized' || status === 'granted';
      }
    }
  };
  openSettings = async () => await Linking.openSettings();

  /******************** GESTURE CONTROLS ********************/

  onOrientationDidChange = orientation => this.setState({orientation});
  deviceRotated = () => this.setState({screen_size: Dimensions.get('window')});
  lockOrientation = async () => {
    new Promise(resolve => {
      const {orientation} = this.state;
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

  tapToFocus = async e => {
    return await this.camera.current
      .focus({
        x: e.nativeEvent.absoluteX,
        y: e.nativeEvent.absoluteY,
      })
      .catch(e => console.log('Focus Error: ', e));
  };

  onPinchStart = () => (this._prevPinch = 1);
  onPinchEnd = () => (this._prevPinch = 1);
  onPinchProgress = p => {
    const {zoom} = this.state;
    const zoom_value = 0.01;
    const p2 = p - this._prevPinch;

    if (p2 > 0 && p2 > zoom_value) {
      this._prevPinch = p;
      this.setState({zoom: Math.min(zoom + zoom_value, 1)}, () => {});
    } else if (p2 < 0 && p2 < -zoom_value) {
      this._prevPinch = p;
      this.setState({zoom: Math.max(zoom - zoom_value * 1.5, 0)}, () => {});
    }
  };

  /******************** CAMERA ACTIONS ********************/

  toggleVideoOrPicture = () => {
    const {is_video} = this.state;
    this.setState({is_video: !is_video});
  };
  toggleCamera = () => {
    const {front_camera} = this.state;
    this.setState({
      front_camera: !front_camera,
      zoom: 0,
    });
  };
  toggleFlash = () => {
    const {flash} = this.state;
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

  /******************** VIDEO CAMERA LIFECYCLE ********************/

  startVideo = async () => {
    const {saveToCameraRoll, upload} = this.props;
    const {flash} = this.state;
    await this.lockOrientation();

    const timestamp1 = new Date().getTime();
    console.log('Starting Video', timestamp1);

    await this.camera.current.startRecording({
      flash: flash,
      fileType: 'mp4',
      onRecordingFinished: async video => {
        console.log('Recording Finished', video);
        console.log('Video Start Timestamp => To Record', timestamp2);

        // Rename File

        const nameConvention =
          upload && upload.nameConvention ? upload.nameConvention : null;
        const file_name = nameConvention ? `${nameConvention}_TS-` : null;

        const newName = `${file_name}${timestamp2}`;
        const finalFile = await renameFile(video, newName);
        video.path = finalFile;

        // Write additional metadata here...
        // console.log('FINAL', finalFile);

        if (saveToCameraRoll) {
          if (
            Platform.OS === 'android' &&
            !(await this.getCameraRollPermissions())
          ) {
            return alert('Camera Roll not permitted');
          }
          CameraRoll.save(finalFile);
        }

        const payload = {
          data: video.path,
          timestamp_start: timestamp2,
        };

        // Unlock Orientations
        Orientation.unlockAllOrientations();

        if (this.props.onRecordingFinished) {
          this.props.onRecordingFinished(payload);
        }

        // Upload Video to API
        if (upload) {
          if (!upload.uploadUrl) return alert('Missing Upload URL');

          const config = {
            url: upload.uploadUrl,
            authToken: upload.authToken ? upload.authToken : null,
            nameConvention: upload.nameConvention
              ? upload.nameConvention
              : null,
          };

          const response = await UploadHTTP.uploadVideo(
            config,
            payload,
            this.props.onUploadProgress,
          );

          if (response.status === 201) {
            if (this.props.onUploadComplete) {
              return this.props.onUploadComplete(response);
            }
          } else {
            if (this.props.onUploadError) {
              return this.props.onUploadError(response);
            }
          }
        }
      },
      onRecordingError: error => {
        if (this.props.onRecordingError) {
          this.props.onRecordingError(error);
        } else {
          console.error('Recording Error', error);
        }
      },
    });

    const timestamp2 = new Date().getTime();
    console.log('Video Started', timestamp2);
    this.setState({is_recording: true});
  };

  endVideo = async () => {
    const timestamp1 = new Date().getTime();
    console.log('Ending Video', timestamp1);
    await this.camera.current.stopRecording();
    const timestamp2 = new Date().getTime();
    console.log('Video Stopped', timestamp2);
    return this.setState({is_recording: false});
  };

  /******************** PICTURE LIFECYCLE ********************/

  takePicture = async () => {
    const {saveToCameraRoll, upload} = this.props;
    const {flash} = this.state;
    const photo = await this.camera.current.takePhoto({
      flash,
      enableAutoRedEyeReduction: true,
      enableAutoStabilization: true,
    });
    const timestamp = new Date().getTime();

    // Rename File

    const nameConvention =
      upload && upload.nameConvention ? upload.nameConvention : null;
    const file_name = nameConvention ? `${nameConvention}_TS-` : null;

    const newName = `${file_name}${timestamp}`;
    const finalFile = await renameFile(photo, newName);
    photo.path = finalFile;

    // Write additional metadata here...
    // console.log('FINAL', finalFile);

    if (saveToCameraRoll) CameraRoll.save(finalFile);
    if (this.props.onTakePicture) this.props.onTakePicture(photo);

    // If Upload...
    if (upload) {
      if (Platform.OS === 'android') photo.path = `file://${photo.path}`;
      const payload = {
        data: photo.path,
        timestamp_start: timestamp,
      };

      if (!upload.uploadUrl) return alert('Missing Upload URL');

      const config = {
        url: upload.uploadUrl,
        authToken: upload.authToken ? upload.authToken : null,
        nameConvention: upload.nameConvention ? upload.nameConvention : null,
      };

      const response = await UploadHTTP.uploadImage(
        config,
        payload,
        this.props.onUploadProgress,
      );

      if (response.status === 201) {
        if (this.props.onUploadComplete) {
          return this.props.onUploadComplete(response);
        }
      } else {
        if (this.props.onUploadError) {
          return this.props.onUploadError(response);
        }
      }
    }
  };

  /******************** RENDERS ********************/

  render() {
    const {
      has_camera_permission,
      has_microphone_permission,
      screen_size,
      camera_active,
      front_camera,
      zoom,
      is_recording,
      is_video,
    } = this.state;
    const has_permissions = has_camera_permission && has_microphone_permission;
    const is_vertical = screen_size.height > screen_size.width;

    if (!has_permissions) {
      return (
        <SafeAreaView
          style={styles.base_container}
          onLayout={this.deviceRotated}>
          <MissingPermissions
            has_camera_permission={this.state.has_camera_permission}
            has_microphone_permission={this.state.has_microphone_permission}
            has_camera_roll_permission={this.state.has_camera_roll_permission}
            openSettings={this.openSettings}
          />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.base_container} onLayout={this.deviceRotated}>
        <StatusBar hidden={true} />

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
                toggleVideoOrPicture={this.toggleVideoOrPicture}
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
                toggleVideoOrPicture={this.toggleVideoOrPicture}
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
      </SafeAreaView>
    );
  }
}
