// // SET_IS_RECORDING

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
      screen_size: Dimensions.get('window'),
      orientation: 'PORTRAIT',
      // Camera Settings
      is_recording: false,
      camera_active: false,
      zoom: 0,
      video_start_time: null,
      // Permissions
      has_camera_permission: false,
      has_microphone_permission: false,
      has_camera_roll_permission: false,
    };

    this.camera = React.createRef();
    this.pinchRef = React.createRef();
    this.doubleTapRef = React.createRef();
    this.swipeRef = React.createRef();
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
        // console.log('CAMERA_STORAGE: ', status);
        return status === 'authorized' || status === 'granted';
      }
    }
  };
  openSettings = async () => await Linking.openSettings();

  /******************** GESTURE CONTROLS ********************/

  onOrientationDidChange = orientation => {
    this.setState({orientation});
    this.props.onOrientationChange(orientation);
  };
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
    const {camera} = this;
    if (camera && camera.current) {
      if (this.props.onTapFocus) this.props.onTapFocus(e);
      return await this.camera.current
        .focus({
          x: e.nativeEvent.absoluteX,
          y: e.nativeEvent.absoluteY,
        })
        .catch(e => console.log('Focus Error: ', e));
    }
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

  onPanStart = () => (this._prevPan = 1);
  onPanEnd = () => (this._prevPan = 1);
  onPanProgress = p => {
    const {onSwipeRight, onSwipeLeft, onSwipeUp, onSwipeDown, panDistance} =
      this.props;

    if (p.translationX > panDistance * 1.5) {
      if (p.translationY > -20 && p.translationY < 20) {
        console.log('RIGHT', p.translationY);
        return onSwipeRight ? onSwipeRight(p) : null;
      }
    } else if (p.translationX < -20) {
      if (p.translationY > -20 && p.translationY < 20) {
        console.log('LEFT', p.translationY);
        return onSwipeLeft ? onSwipeLeft(p) : null;
      }
    }

    if (p.translationY > panDistance * 1.5) {
      if (p.translationX > -20 && p.translationX < 20) {
        console.log('DOWN', p.translationX);
        return onSwipeDown ? onSwipeDown(p) : null;
      }
    } else if (p.translationY < -20) {
      if (p.translationX > -20 && p.translationX < 20) {
        console.log('UP', p.translationX);
        return onSwipeUp ? onSwipeUp(p) : null;
      }
    }
  };

  /******************** CAMERA ACTIONS ********************/

  toggleVideoOrPicture = () => {
    const {setIsVideo} = this.props.stateActions;
    if (setIsVideo) setIsVideo();
  };
  toggleCamera = () => {
    const {toggleFrontCamera} = this.props.stateActions;
    if (toggleFrontCamera) toggleFrontCamera();
    this.setState({zoom: 0});
  };
  toggleFlash = () => {
    const {toggleFlash} = this.props.stateActions;
    if (toggleFlash) toggleFlash();
  };

  /******************** VIDEO CAMERA LIFECYCLE ********************/

  startVideo = async () => {
    const {saveToCameraRoll, upload, cameraState} = this.props;
    const {flash} = cameraState;
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
        const file_name = nameConvention ? `${nameConvention}_TS` : null;

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
        if (upload && upload.uploadUrl) {
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
    this.props.onRecordingStart();
  };

  endVideo = async () => {
    const timestamp1 = new Date().getTime();
    console.log('Ending Video', timestamp1);
    await this.camera.current.stopRecording();
    const timestamp2 = new Date().getTime();
    console.log('Video Stopped', timestamp2);

    this.setState({is_recording: false});
  };

  /******************** PICTURE LIFECYCLE ********************/

  takePicture = async () => {
    const {saveToCameraRoll, upload, cameraState} = this.props;
    const {flash} = cameraState;
    console.log('FLASH_STATUS: ', flash);

    const photo = await this.camera.current.takePhoto({
      flash: flash,
      enableAutoRedEyeReduction: true,
      enableAutoStabilization: true,
      enableAutoRedEyeReduction: true,
      qualityPrioritization: 'balanced',
      metadata: {
        Exif: {},
      },
    });
    const timestamp = new Date().getTime();

    // Rename File

    const nameConvention =
      upload && upload.nameConvention ? upload.nameConvention : null;
    const file_name = nameConvention ? `${nameConvention}_TS` : null;

    const newName = `${file_name}${timestamp}`;
    const finalFile = await renameFile(photo, newName);
    photo.path = finalFile;

    console.log('PHOTO: ', photo);

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

      if (!upload.uploadUrl) {
        return console.log('Upload Error: Upload URL not set');
      }

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
    const {cameraConfig, icons, children, cameraState} = this.props;

    const {isVideo, frontCamera} = cameraState;
    const {
      has_camera_permission,
      has_microphone_permission,
      screen_size,
      camera_active,
      is_recording,
      zoom,
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
          frontCamera={frontCamera}
          zoom={zoom}
          config={cameraConfig}
        />

        <GestureHandler
          pinchRef={this.pinchRef}
          doubleTapRef={this.doubleTapRef}
          swipeRef={this.swipeRef}
          onSingleTap={this.tapToFocus}
          onDoubleTap={this.props.onDoubleTap ? this.props.onDoubleTap : null}
          onPinchProgress={this.onPinchProgress}
          onPinchStart={this.onPinchStart}
          onPinchEnd={this.onPinchEnd}
          panDistance={this.props.panDistance}
          onPanProgress={this.onPanProgress}
          onPanStart={this.onPanStart}
          onPanEnd={this.onPanEnd}>
          <View>
            {is_vertical ? (
              <CameraControlsVertical
                icons={icons}
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
                          is_recording={is_recording}
                          startVideo={this.startVideo}
                          endVideo={this.endVideo}
                          toggleCamera={this.toggleCamera}
                          cameraState={cameraState}
                          icons={icons}
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
                          state={this.state}
                          icons={icons}
                        />
                      ),
                    }}
              </CameraControlsVertical>
            ) : (
              <CameraControlsHorizontal
                icons={icons}
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
                          is_recording={is_recording}
                          startVideo={this.startVideo}
                          endVideo={this.endVideo}
                          toggleCamera={this.toggleCamera}
                          cameraState={cameraState}
                          icons={icons}
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
                          state={this.state}
                          icons={icons}
                        />
                      ),
                    }}
              </CameraControlsHorizontal>
            )}
          </View>
        </GestureHandler>
      </SafeAreaView>
    );
  }
}
