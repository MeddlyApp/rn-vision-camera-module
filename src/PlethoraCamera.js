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
import RenderCamera from './components/RenderCamera';
import MissingPermissions from './components/MissingPermissions';
import CameraControlsHorizontal from './components/CameraControlsHorizontal';
import CameraControlsVertical from './components/CameraControlsVertical';
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
    children,
  } = props;

  const {isVideo, frontCamera, flash, isRecording} = cameraState;
  const {
    startRecording,
    stopRecording,
    setIsVideo,
    toggleFrontCamera,
    toggleFlash,
  } = stateActions;

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
    const hasMic = await getMicrophonePermissions();
    const hasCamRoll = await getCameraRollPermissions();
    setHasCameraPermission(hasCamera);
    setHasMicrophonePermission(hasMic);
    setHasCameraRollPermission(hasCamRoll);
  };

  const getCameraPermissions = async () => {
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

  const getMicrophonePermissions = async () => {
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

  const getCameraRollPermissions = async () => {
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
  const openSettings = async () => await Linking.openSettings();

  // ******************** ORIENTATION CONTROLS ******************** //

  const [orientation, setOrientation] = useState(null);
  const onOrientationDidChange = orientation => {
    setOrientation(orientation);
    if (onOrientationChange) onOrientationChange(orientation);
  };
  const [screenSize, setScreenSize] = useState(Dimensions.get('window'));
  const deviceRotated = () => setScreenSize(Dimensions.get('window'));
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
          return resolve(console.log('Lock Orientation Error'));
      }
    });
  };

  // ******************** CAMERA ACTIONS ******************** //

  const [zoomValue, setZoomValue] = useState(0);
  const toggleVideoOrPicture = () => {
    if (setIsVideo) setIsVideo();
  };
  const toggleCamera = () => {
    if (toggleFrontCamera) toggleFrontCamera();
    setZoomValue(0);
  };
  const toggleFlashOnOff = () => {
    if (toggleFlash) toggleFlash();
  };

  /******************** VIDEO CAMERA LIFECYCLE ********************/

  const startVideo = async () => {
    if (startRecording && stopRecording) {
      await lockOrientation();
      await cameraRef.current.startRecording({
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
          const fileName = nameConvention ? `${nameConvention}_TS` : null;

          const newName = `${fileName}${timestamp}`;
          const finalFile = await renameFile(video, newName);
          video.path = finalFile;

          if (saveToCameraRoll) {
            if (
              Platform.OS === 'android' &&
              !(await getCameraRollPermissions())
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

          if (onRecordingFinished) onRecordingFinished(payload);
        },
        onRecordingError: error => {
          if (onRecordingError) onRecordingError(error);
          else console.error('Recording Error', error);
        },
      });

      const timestamp = new Date().getTime();
      startRecording();

      // Set Elapsed Time here...
      if (onRecordingStart) onRecordingStart(timestamp);
    } else if (!startRecording && stopRecording) {
      return alert('Missing prop: startRecording()');
    } else if (startRecording && !stopRecording) {
      return alert('Missing prop: endVideo()');
    } else return;
  };

  const endVideo = async () => {
    if (stopRecording) {
      await stopRecording();
      await cameraRef.current.stopRecording();
    } else alert('Please add endVideo() prop');
  };

  /******************** PICTURE LIFECYCLE ********************/

  const [showTakePicIndicator, setShowTakePicIndicator] = useState(false);
  const takePicture = async () => {
    setShowTakePicIndicator(true);
    const photo = await cameraRef.current.takePhoto({
      flash: frontCamera ? 'off' : flash,
      // enableAutoRedEyeReduction: true,
      // enableAutoStabilization: true,
      // enableAutoRedEyeReduction: true,
      // qualityPrioritization: 'balanced',
      // skipMetadata: true,
    });
    setShowTakePicIndicator(false);

    // Rename File
    const nameConvention = config.nameConvention ? config.nameConvention : null;
    const fileName = nameConvention ? `${nameConvention}_TS` : null;
    const timestamp = new Date().getTime();

    const newName = `${fileName}${timestamp}`;
    const finalFile = await renameFile(photo, newName);
    photo.path = finalFile;

    // Write additional metadata here...

    if (saveToCameraRoll) CameraRoll.save(finalFile);
    if (onTakePicture) onTakePicture(photo);
  };

  /******************** RENDERS ********************/

  const hasAllPermissions = hasCameraPermission && hasMicrophonePermission;
  const displayIsVertical = screenSize.height > screenSize.width;

  if (!hasAllPermissions) {
    return (
      <SafeAreaView style={styles.base_container} onLayout={deviceRotated}>
        <MissingPermissions
          hasCameraPermission={hasCameraPermission}
          hasMicrophonePermission={hasMicrophonePermission}
          hasCameraRollPermission={hasCameraRollPermission}
          openSettings={openSettings}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.base_container} onLayout={deviceRotated}>
      <StatusBar hidden={true} />

      <RenderCamera
        cameraRef={cameraRef}
        frontCamera={frontCamera}
        zoomValue={zoomValue}
        setZoomValue={setZoomValue}
        config={config}
        showTakePicIndicator={showTakePicIndicator}
        onDoubleTap={onDoubleTap ? onDoubleTap : () => null}
        swipeDistance={swipeDistance}
        onSwipeUp={onSwipeUp}
        onSwipeDown={onSwipeDown}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />

      {showCameraControls ? (
        displayIsVertical ? (
          <CameraControlsVertical
            screenSize={screenSize}
            orientation={orientation}
            cameraState={cameraState}
            children={children}
            toggleCamera={toggleCamera}
            toggleFlash={toggleFlashOnOff}
            toggleVideoOrPicture={toggleVideoOrPicture}>
            {isVideo
              ? {
                  children,
                  videoControls: (
                    <VideoControls
                      isRecording={isRecording}
                      startVideo={startVideo}
                      endVideo={endVideo}
                      toggleCamera={toggleCamera}
                      cameraState={cameraState}
                      icons={children.icons ? children.icons : null}
                      screenSize={screenSize}
                    />
                  ),
                }
              : {
                  children,
                  pictureControls: (
                    <PictureControls
                      takePicture={takePicture}
                      toggleCamera={toggleCamera}
                      cameraState={cameraState}
                      icons={children.icons ? children.icons : null}
                      screenSize={screenSize}
                    />
                  ),
                }}
          </CameraControlsVertical>
        ) : (
          <CameraControlsHorizontal
            screenSize={screenSize}
            orientation={orientation}
            cameraState={cameraState}
            children={children}
            toggleCamera={toggleCamera}
            toggleFlash={toggleFlashOnOff}
            toggleVideoOrPicture={toggleVideoOrPicture}>
            {isVideo
              ? {
                  children,
                  videoControls: (
                    <VideoControls
                      isRecording={isRecording}
                      startVideo={startVideo}
                      endVideo={endVideo}
                      toggleCamera={toggleCamera}
                      cameraState={cameraState}
                      icons={children.icons ? children.icons : null}
                      screenSize={screenSize}
                    />
                  ),
                }
              : {
                  children,
                  pictureControls: (
                    <PictureControls
                      takePicture={takePicture}
                      toggleCamera={toggleCamera}
                      cameraState={cameraState}
                      icons={children.icons ? children.icons : null}
                      screenSize={screenSize}
                    />
                  ),
                }}
          </CameraControlsHorizontal>
        )
      ) : null}
    </SafeAreaView>
  );
}
