/*/
 * COMPONENT LIFECYCLE
 * PERMISSIONS
 * ORIENTATION CONTROLS
 * CAMERA ACTIONS
 * VIDEO CAMERA LIFECYCLE
 * PICTURE LIFECYCLE
 * RENDERS
/*/

import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  LogBox,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  View,
  Linking,
  StatusBar,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Orientation from 'react-native-orientation-locker';
import RenderCamera from './components/RenderCamera';
import MissingPermissions from './components/MissingPermissions';
import CameraControls from './components/CameraControls';
import VideoControls from './components/VideoControls';
import PictureControls from './components/PictureControls';
import renameFile from '../utilities/RenameFile';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

export default function PlethoraCamera(props) {
  const cameraRef = useRef();

  const {
    cameraState,
    config,
    stateActions,
    onOrientationChange,
    onTakePicture,
    onRecordingStart,
    onRecordingFinished,
    onRecordingError,
    saveToCameraRoll,
    onDoubleTap,
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
    swipeDistance,
    showCameraControls,
    sectionHeights,
    children,
  } = props;

  const {isVideo, frontCamera, flash, isRecording, hideStatusBar} = cameraState;

  const {
    startRecording,
    stopRecording,
    setIsVideo,
    toggleFrontCamera,
    toggleFlash,
  } = stateActions;

  const isAndroid = Platform.OS === 'android';

  // ******************** COMPONENT LIFECYCLE ******************** //

  useEffect(() => {
    checkPermissions();
    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(onOrientationDidChange);
    return () => {
      Orientation.removeOrientationListener(onOrientationDidChange);
    };
  }, []);

  // ******************** PERMISSIONS ******************** //

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);

  const checkPermissions = async () => {
    const hasCamera = await getCameraPermissions();
    setHasCameraPermission(hasCamera);
    const hasMic = await getMicrophonePermissions();
    setHasMicrophonePermission(hasMic);
    const hasCamRoll = await getCameraRollPermissions();
    setHasCameraRollPermission(hasCamRoll);
  };

  const getCameraPermissions = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const isAuthorized = cameraPermission === 'authorized';
    const isNotDetermined = cameraPermission === 'not-determined';
    const isDenied = cameraPermission === 'denied';
    if (isAuthorized) return true;
    if (isNotDetermined || isDenied) {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission === 'authorized') return true;
      return false;
    } else return false;
  };

  const getMicrophonePermissions = async () => {
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    const isAuthorized = microphonePermission === 'authorized';
    const isNotDetermined = microphonePermission === 'not-determined';
    const isDenied = microphonePermission === 'denied';
    if (isAuthorized) return true;
    if (isNotDetermined || isDenied) {
      const newMicrophonePermission =
        await Camera.requestMicrophonePermission();
      if (newMicrophonePermission === 'authorized') return true;
      return false;
    } else return false;
  };

  const getCameraRollPermissions = async () => {
    if (isAndroid) {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) return true;
      else {
        const status = await PermissionsAndroid.request(permission);
        return status === 'authorized' || status === 'granted';
      }
    }
  };
  const openSettings = async () => await Linking.openSettings();

  // ******************** ORIENTATION CONTROLS ******************** //

  const [orientation, setOrientation] = useState(null);

  const onOrientationDidChange = orientation => {
    setOrientation(orientation);
    if (onOrientationChange) onOrientationChange(orientation);
  };

  const lockOrientation = async () => {
    new Promise(resolve => {
      switch (orientation) {
        case 'PORTRAIT':
          return resolve(Orientation.lockToPortrait());
        case 'LANDSCAPE-LEFT':
          return resolve(Orientation.lockToLandscapeLeft());
        case 'LANDSCAPE-RIGHT':
          return resolve(Orientation.lockToLandscapeRight());
        default:
          return resolve(Orientation.lockToPortrait());
      }
    });
  };

  // ******************** CAMERA ACTIONS ******************** //

  const [zoomValue, setZoomValue] = useState(0);
  const toggleVideoOrPicture = () => (setIsVideo ? setIsVideo() : null);
  const toggleFlashOnOff = () => (toggleFlash ? toggleFlash() : null);
  const toggleCamera = () => {
    if (toggleFrontCamera) toggleFrontCamera();
    setZoomValue(0);
  };

  /******************** VIDEO CAMERA LIFECYCLE ********************/

  const startVideo = async () => {
    if (startRecording && stopRecording && !isRecording) {
      const ready = await startRecording();

      if (ready) {
        await lockOrientation();

        console.log('Recording - Pre', new Date().getTime());
        await cameraRef.current.startRecording({
          flash: frontCamera ? 'off' : flash,
          fileType: 'mp4',
          onRecordingFinished: async video => {
            const timestampEnd = new Date().getTime();
            const nameConvention = config.nameConvention
              ? config.nameConvention
              : null;
            const fileName = nameConvention ? `${nameConvention}_TS` : null;
            const newName = `${fileName}${timestamp}`;
            const finalFile = await renameFile(video, newName);
            video.path = finalFile;

            if (saveToCameraRoll) {
              if (isAndroid && !(await getCameraRollPermissions())) {
                return alert('Camera Roll not permitted');
              }
              CameraRoll.save(finalFile);
            }

            console.log('Recording - Ended', timestampEnd);

            const payload = {
              data: video.path,
              duration: video.duration,
              timestamp_start: timestamp,
              timestamp_end: timestampEnd,
              orientation: orientation,
            };

            Orientation.unlockAllOrientations();
            if (onRecordingFinished) onRecordingFinished(payload);
          },
          onRecordingError: error => {
            if (onRecordingError) onRecordingError(error);
            else console.error('Recording Error', error);
          },
        });

        const timestamp = new Date().getTime();
        if (onRecordingStart) return onRecordingStart(timestamp);
      }
      console.log('Recording - Active', new Date().getTime());
    } else if (!startRecording && stopRecording) {
      return alert('Missing prop: startRecording()');
    } else if (startRecording && !stopRecording) {
      return alert('Missing prop: endVideo()');
    } else return;
  };

  const endVideo = async () => {
    if (stopRecording && isRecording) {
      const ready = await stopRecording();
      if (ready) return await cameraRef.current.stopRecording();
    } else alert('Please add endVideo() prop');
  };

  /******************** PICTURE LIFECYCLE ********************/

  const [showTakePicIndicator, setShowTakePicIndicator] = useState(false);
  const takePicture = async () => {
    setShowTakePicIndicator(true);
    const photo = await cameraRef.current.takePhoto({
      flash: frontCamera ? 'off' : flash,
    });
    setShowTakePicIndicator(false);

    const nameConvention = config.nameConvention ? config.nameConvention : null;
    const fileName = nameConvention ? `${nameConvention}_TS` : null;
    const timestamp = new Date().getTime();
    const newName = `${fileName}${timestamp}`;
    const finalFile = await renameFile(photo, newName);
    photo.path = finalFile;
    if (saveToCameraRoll) CameraRoll.save(finalFile);
    if (onTakePicture) onTakePicture(photo);
  };

  /******************** RENDERS ********************/

  const hasAllPermissions = hasCameraPermission && hasMicrophonePermission;

  if (!hasAllPermissions) {
    return (
      <View style={styles.base_container}>
        <SafeAreaView style={styles.missing_permissions}>
          <MissingPermissions
            hasCameraPermission={hasCameraPermission}
            hasMicrophonePermission={hasMicrophonePermission}
            hasCameraRollPermission={hasCameraRollPermission}
            openSettings={openSettings}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.base_container}>
      <StatusBar
        hidden={hideStatusBar}
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <RenderCamera
        cameraRef={cameraRef}
        frontCamera={frontCamera}
        zoomValue={zoomValue}
        setZoomValue={setZoomValue}
        config={config}
        cameraState={cameraState}
        getDeviceInfo={
          stateActions && stateActions.getDeviceInfo
            ? stateActions.getDeviceInfo
            : null
        }
        showTakePicIndicator={showTakePicIndicator}
        onDoubleTap={onDoubleTap ? onDoubleTap : () => null}
        swipeDistance={swipeDistance}
        onSwipeUp={onSwipeUp}
        onSwipeDown={onSwipeDown}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />

      {showCameraControls ? (
        <CameraControls
          cameraState={cameraState}
          sectionHeights={sectionHeights}
          customComponents={children ? children : null}
          toggleCamera={toggleCamera}
          toggleFlash={toggleFlashOnOff}
          toggleVideoOrPicture={toggleVideoOrPicture}
          orientation={orientation}>
          {{
            customComponents: children,
            controls: isVideo ? (
              <VideoControls
                isRecording={isRecording}
                startVideo={startVideo}
                endVideo={endVideo}
                toggleCamera={toggleCamera}
                cameraState={cameraState}
                icons={children && children.icons ? children.icons : null}
              />
            ) : (
              <PictureControls
                takePicture={takePicture}
                toggleCamera={toggleCamera}
                cameraState={cameraState}
                icons={children && children.icons ? children.icons : null}
              />
            ),
          }}
        </CameraControls>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base_container: {
    flex: 1,
    backgroundColor: '#000',
  },
  missing_permissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
