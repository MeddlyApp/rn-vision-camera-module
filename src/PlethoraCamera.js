/*/
 * COMPONENT LIFECYCLE
 * PERMISSIONS
 * ORIENTATION CONTROLS
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
  Dimensions,
  StatusBar,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Orientation from 'react-native-orientation-locker';
import styles from './styles';
import RenderCamera from './Components/RenderCamera';
import MissingPermissions from './Components/MissingPermissions';
import CameraControlsHorizontal from './Components/CameraControlsHorizontal';
import CameraControlsVertical from './Components/CameraControlsVertical';
import VideoControls from './Components/VideoControls';
import PictureControls from './Components/PictureControls';
import renameFile from '../utilities/RenameFile';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

export default class PlethoraCamera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen_size: Dimensions.get('window'),
      orientation: 'PORTRAIT',
      // Camera Settings
      recording_elapsed_time: 0,
      zoomValue: 0,
      video_start_time: null,
      showTakePicIndicator: false,
      // Permissions
      has_camera_permission: false,
      has_microphone_permission: false,
      has_camera_roll_permission: false,
    };

    this.cameraRef = React.createRef();
  }

  // ******************** COMPONENT LIFECYCLE ******************** //

  componentDidMount = async () => {
    await this.checkPermissions();

    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(this.onOrientationDidChange);
  };

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.onOrientationDidChange);
  }

  // ******************** PERMISSIONS ******************** //

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
        return status === 'authorized' || status === 'granted';
      }
    }
  };
  openSettings = async () => await Linking.openSettings();

  // ******************** ORIENTATION CONTROLS ******************** //

  onOrientationDidChange = orientation => {
    this.setState({orientation});
    if (this.props.onOrientationChange) {
      this.props.onOrientationChange(orientation);
    }
  };
  deviceRotated = () => {
    const screen_size = Dimensions.get('window');
    this.setState({screen_size});
  };
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

  // ******************** CAMERA ACTIONS ******************** //

  toggleVideoOrPicture = () => {
    const {setIsVideo} = this.props.stateActions;
    if (setIsVideo) setIsVideo();
  };
  toggleCamera = () => {
    const {toggleFrontCamera} = this.props.stateActions;
    if (toggleFrontCamera) toggleFrontCamera();
    this.setState({zoomValue: 0});
  };
  toggleFlash = () => {
    const {toggleFlash} = this.props.stateActions;
    if (toggleFlash) toggleFlash();
  };

  /******************** VIDEO CAMERA LIFECYCLE ********************/

  startVideo = async () => {
    const {saveToCameraRoll, cameraState, config, stateActions} = this.props;
    const {flash, frontCamera, isRecording} = cameraState;
    const {startRecording, stopRecording} = stateActions;

    if (startRecording && stopRecording) {
      await this.lockOrientation();
      await this.cameraRef.current.startRecording({
        flash: frontCamera ? 'off' : flash,
        fileType: 'mp4',
        onRecordingFinished: async video => {
          // Write additional metadata here...

          // End Timestamp
          const timestampEnd = new Date().getTime();

          // Rename File
          const nameConvention = config.nameConvention
            ? config.nameConvention
            : null;
          const file_name = nameConvention ? `${nameConvention}_TS` : null;

          const newName = `${file_name}${timestamp}`;
          const finalFile = await renameFile(video, newName);
          video.path = finalFile;

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
            duration: video.duration,
            timestamp_start: timestamp,
            timestamp_end: timestampEnd,
          };

          Orientation.unlockAllOrientations();

          if (this.props.onRecordingFinished) {
            this.props.onRecordingFinished(payload);
          }
        },
        onRecordingError: error => {
          if (this.props.onRecordingError) {
            this.props.onRecordingError(error);
          } else console.error('Recording Error', error);
        },
      });

      const timestamp = new Date().getTime();
      startRecording();
      this.startVideoTimer();

      // Set Elapsed Time here...
      if (this.props.onRecordingStart) this.props.onRecordingStart(timestamp);
    } else if (!startRecording && stopRecording) {
      return alert('Missing prop: startRecording()');
    } else if (startRecording && !stopRecording) {
      return alert('Missing prop: endVideo()');
    } else return;
  };

  endVideo = async () => {
    const {stopRecording} = this.props.stateActions;
    if (stopRecording) {
      await stopRecording();
      await this.cameraRef.current.stopRecording();
      this.endVideoTimer();
    } else alert('Please add endVideo() prop');
  };

  startVideoTimer = () => {
    this.intervalID = setInterval(this.updateElapsedTime, 1000);
  };
  endVideoTimer = () => {
    clearInterval(this.intervalID);
    this.setState({recording_elapsed_time: 0});
  };
  updateElapsedTime = () => {
    const {recording_elapsed_time} = this.state;
    this.setState({recording_elapsed_time: recording_elapsed_time + 1});
  };

  /******************** PICTURE LIFECYCLE ********************/

  takePicture = async () => {
    const {saveToCameraRoll, cameraState, config} = this.props;
    const {flash, frontCamera, isRecording} = cameraState;

    this.setState({showTakePicIndicator: true});
    const photo = await this.cameraRef.current.takePhoto({
      flash: frontCamera ? 'off' : flash,
      // enableAutoRedEyeReduction: true,
      // enableAutoStabilization: true,
      // enableAutoRedEyeReduction: true,
      // qualityPrioritization: 'balanced',
      // skipMetadata: true,
    });
    this.setState({showTakePicIndicator: false});

    // Rename File
    const nameConvention = config.nameConvention ? config.nameConvention : null;
    const file_name = nameConvention ? `${nameConvention}_TS` : null;
    const timestamp = new Date().getTime();

    const newName = `${file_name}${timestamp}`;
    const finalFile = await renameFile(photo, newName);
    photo.path = finalFile;

    // Write additional metadata here...

    if (saveToCameraRoll) CameraRoll.save(finalFile);
    if (this.props.onTakePicture) this.props.onTakePicture(photo);
  };

  /******************** RENDERS ********************/

  render() {
    const {config, children, cameraState} = this.props;
    const {isVideo, frontCamera, flash, isRecording} = cameraState;
    const {
      has_camera_permission,
      has_microphone_permission,
      screen_size,
      zoomValue,
      showTakePicIndicator,
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
          cameraRef={this.cameraRef}
          frontCamera={frontCamera}
          zoomValue={zoomValue}
          setZoomValue={x => this.setState(x)}
          config={config}
          showTakePicIndicator={showTakePicIndicator}
          onDoubleTap={
            this.props.onDoubleTap ? this.props.onDoubleTap : () => null
          }
          swipeDistance={this.props.swipeDistance}
          onSwipeUp={this.props.onSwipeUp}
          onSwipeDown={this.props.onSwipeDown}
          onSwipeLeft={this.props.onSwipeLeft}
          onSwipeRight={this.props.onSwipeRight}
        />

        {this.props.showCameraControls ? (
          is_vertical ? (
            <CameraControlsVertical
              state={this.state}
              cameraState={cameraState}
              children={children}
              toggleCamera={this.toggleCamera}
              toggleFlash={this.toggleFlash}
              toggleVideoOrPicture={this.toggleVideoOrPicture}>
              {isVideo
                ? {
                    children,
                    videoControls: (
                      <VideoControls
                        isRecording={isRecording}
                        startVideo={this.startVideo}
                        endVideo={this.endVideo}
                        toggleCamera={this.toggleCamera}
                        cameraState={cameraState}
                        icons={children.icons ? children.icons : null}
                        screenSize={screen_size}
                      />
                    ),
                  }
                : {
                    children,
                    pictureControls: (
                      <PictureControls
                        takePicture={this.takePicture}
                        toggleCamera={this.toggleCamera}
                        cameraState={cameraState}
                        icons={children.icons ? children.icons : null}
                        screenSize={screen_size}
                      />
                    ),
                  }}
            </CameraControlsVertical>
          ) : (
            <CameraControlsHorizontal
              state={this.state}
              cameraState={cameraState}
              children={children}
              toggleCamera={this.toggleCamera}
              toggleFlash={this.toggleFlash}
              toggleVideoOrPicture={this.toggleVideoOrPicture}>
              {isVideo
                ? {
                    children,
                    videoControls: (
                      <VideoControls
                        isRecording={isRecording}
                        startVideo={this.startVideo}
                        endVideo={this.endVideo}
                        toggleCamera={this.toggleCamera}
                        cameraState={cameraState}
                        icons={children.icons ? children.icons : null}
                        screenSize={screen_size}
                      />
                    ),
                  }
                : {
                    children,
                    pictureControls: (
                      <PictureControls
                        takePicture={this.takePicture}
                        toggleCamera={this.toggleCamera}
                        cameraState={cameraState}
                        icons={children.icons ? children.icons : null}
                        screenSize={screen_size}
                      />
                    ),
                  }}
            </CameraControlsHorizontal>
          )
        ) : null}
      </SafeAreaView>
    );
  }
}
