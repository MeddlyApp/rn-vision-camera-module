/*/
 * COMPONENT LIFECYCLE
 * PERMISSIONS
 * ORIENTATION CONTROLS
 * VIDEO CAMERA LIFECYCLE
 * PICTURE LIFECYCLE
 * RENDERS
/*/

import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  StyleSheet,
  LogBox,
  SafeAreaView,
  View,
  Linking,
  StatusBar,
  useWindowDimensions,
  Alert,
  NativeTouchEvent,
} from 'react-native';
import {Camera, CaptureError, VideoFile} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Orientation, {OrientationType} from 'react-native-orientation-locker';
import {
  CameraConfig,
  CameraState,
  CustomComponents,
  PhotoPlayload,
  SectionHeights,
  StateActions,
  VideoPayload,
} from './Interfaces';
import RenderCamera from './components/RenderCamera';
import MissingPermissions from './components/MissingPermissions';
import CameraControls from './components/CameraControls';
import VideoControls from './components/VideoControls';
import PictureControls from './components/PictureControls';
import renameFile from '../utilities/RenameFile';
import {GestureEventPayload} from 'react-native-gesture-handler';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

interface Props {
  cameraState: CameraState;
  config: CameraConfig;
  isFocused: boolean;
  stateActions: StateActions;
  onOrientationChange?: (val: string) => void;
  onIsRecording?: (val: boolean) => void;
  onTakePicture?: (val: PhotoPlayload) => void;
  onRecordingStart?: (val: number) => void;
  onRecordingFinished?: (val: VideoPayload) => void;
  onRecordingError: (val: CaptureError) => void;
  saveToCameraRoll?: boolean;
  onSingleTap?: (val: GestureEventPayload) => void;
  onDoubleTap?: (val: GestureEventPayload) => void;
  onSwipeUp?: (val: NativeTouchEvent) => void;
  onSwipeDown?: (val: NativeTouchEvent) => void;
  onSwipeLeft?: (val: NativeTouchEvent) => void;
  onSwipeRight?: (val: NativeTouchEvent) => void;
  swipeDistance?: number;
  showCameraControls?: boolean;
  sectionHeights: SectionHeights;
  children: CustomComponents;
}

export default function PlethoraCamera(props: Props) {
  const cameraRef = useRef<any>(null);

  const {
    cameraState,
    config,
    isFocused,
    stateActions,
    onOrientationChange,
    onIsRecording,
    onTakePicture,
    onRecordingStart,
    onRecordingFinished,
    onRecordingError,
    saveToCameraRoll,
    onSingleTap,
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

  const {isVideo, frontCamera, flash, hideStatusBar, zoomValue} = cameraState;
  const {startRecording, stopRecording, setZoomValue} = stateActions;
  const {height, width} = useWindowDimensions();

  // ******************** PERMISSIONS ******************** //

  const [hasCameraPermission, setHasCameraPermission] =
    useState<boolean>(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] =
    useState<boolean>(false);

  const getCameraPermissions = useCallback(async () => {
    const cameraPermission: string = await Camera.getCameraPermissionStatus();
    const isAuthorized: boolean = cameraPermission === 'authorized';
    const isNotDetermined: boolean = cameraPermission === 'not-determined';
    const isDenied: boolean = cameraPermission === 'denied';
    if (isAuthorized) return true;
    if (isNotDetermined || isDenied) {
      const newCameraPermission: string =
        await Camera.requestCameraPermission();
      if (newCameraPermission === 'authorized') return true;
      return false;
    } else return false;
  }, []);

  const getMicrophonePermissions = useCallback(async () => {
    const microphonePermission: string =
      await Camera.getMicrophonePermissionStatus();
    const isAuthorized: boolean = microphonePermission === 'authorized';
    const isNotDetermined: boolean = microphonePermission === 'not-determined';
    const isDenied: boolean = microphonePermission === 'denied';
    if (isAuthorized) return true;
    if (isNotDetermined || isDenied) {
      const newMicrophonePermission =
        await Camera.requestMicrophonePermission();
      if (newMicrophonePermission === 'authorized') return true;
      return false;
    } else return false;
  }, []);

  const checkPermissions = useCallback(async () => {
    const hasCamera: boolean = await getCameraPermissions();
    setHasCameraPermission(hasCamera);

    const hasMic: boolean = await getMicrophonePermissions();
    setHasMicrophonePermission(hasMic);
  }, [getCameraPermissions, getMicrophonePermissions]);
  const openSettings = async () => await Linking.openSettings();

  // ******************** ORIENTATION CONTROLS ******************** //

  const [orientation, setOrientation] = useState<string>('');

  const onOrientationDidChange = useCallback(
    (o: OrientationType) => {
      setOrientation(o);
      if (onOrientationChange) onOrientationChange(o);
    },
    [onOrientationChange],
  );

  const lockOrientation = async () => {
    console.log('Locking orientation', orientation);
    return await new Promise(resolve => {
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

  // ******************** COMPONENT LIFECYCLE ******************** //

  useEffect(() => {
    checkPermissions();
    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(onOrientationDidChange);
    return () => {
      Orientation.removeOrientationListener(onOrientationDidChange);
    };
  }, [checkPermissions, onOrientationDidChange]);

  /******************** VIDEO CAMERA LIFECYCLE ********************/

  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    if (onIsRecording) onIsRecording(isRecording);
  }, [isRecording, onIsRecording]);

  const startVideo = async () => {
    if (!isRecording) {
      const ready = await startRecording();

      if (ready) {
        await lockOrientation();
        setIsRecording(true);

        const orientationWatchValue: string =
          height > width ? 'portrait' : 'landscape';

        // In React Native Vision Camera V2, this doesn't
        // actually await. V3 should fix this...
        await cameraRef.current.startRecording({
          flash: frontCamera ? 'off' : flash,
          fileType: 'mp4',
          onRecordingFinished: async (video: VideoFile) => {
            setIsRecording(false);
            const timestampEnd = new Date().getTime();
            const nameConvention = config.nameConvention
              ? config.nameConvention
              : null;
            const fileName: string | null = nameConvention
              ? `${nameConvention}_TS`
              : null;
            const newName = `${fileName}${timestamp}`;
            const finalFile: string = await renameFile(video, newName);
            video.path = finalFile;

            if (saveToCameraRoll) CameraRoll.save(finalFile);

            const payload: VideoPayload = {
              data: video.path,
              duration: video.duration,
              timestamp_start: timestamp,
              timestamp_end: timestampEnd,
              orientation: orientationWatchValue,
              height: height > width ? 1920 : 1080,
              width: height > width ? 1080 : 1920,
            };

            Orientation.unlockAllOrientations();
            if (onRecordingFinished) onRecordingFinished(payload);
          },
          onRecordingError: (error: CaptureError) => {
            setIsRecording(false);
            if (onRecordingError) onRecordingError(error);
            else console.error('Recording Error', error);
          },
        });

        const timestamp: number = new Date().getTime();
        if (onRecordingStart) return onRecordingStart(timestamp);
      }
      console.log('Recording - Active', new Date().getTime());
    }
  };

  const endVideo = async () => {
    if (isRecording) {
      setIsRecording(false);
      const ready = await stopRecording();
      if (ready) return await cameraRef.current.stopRecording();
    } else Alert.alert('Please add endVideo() prop');
  };

  /******************** PICTURE LIFECYCLE ********************/

  const [showTakePicIndicator, setShowTakePicIndicator] = useState(false);
  const takePicture = async () => {
    setShowTakePicIndicator(true);
    const photo: PhotoPlayload = await cameraRef.current.takePhoto({
      flash: frontCamera ? 'off' : flash,
    });
    setShowTakePicIndicator(false);

    const nameConvention = config.nameConvention ? config.nameConvention : null;
    const fileName = nameConvention ? `${nameConvention}_TS` : null;
    const timestamp = new Date().getTime();
    const newName = `${fileName}${timestamp}`;
    const finalFile = await renameFile(photo, newName);
    photo.path = finalFile;

    const orientationWatchValue = height > width ? 'portrait' : 'landscape';
    photo.orientation = orientationWatchValue;
    photo.height = height > width ? 1920 : 1080;
    photo.width = height > width ? 1080 : 1920;

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
        isFocused={isFocused}
        frontCamera={frontCamera}
        zoomValue={zoomValue}
        setZoomValue={setZoomValue}
        config={config}
        cameraState={cameraState}
        getDeviceInfo={
          stateActions?.getDeviceInfo ? stateActions.getDeviceInfo : undefined
        }
        showTakePicIndicator={showTakePicIndicator}
        onSingleTap={onSingleTap ? onSingleTap : () => null}
        onDoubleTap={onDoubleTap ? onDoubleTap : () => null}
        swipeDistance={swipeDistance}
        onSwipeUp={onSwipeUp}
        onSwipeDown={onSwipeDown}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />

      {showCameraControls ? (
        <CameraControls
          isRecording={isRecording}
          sectionHeights={sectionHeights}
          orientation={orientation}>
          {{
            customComponents: children,
            controls: isVideo ? (
              <VideoControls
                isRecording={isRecording}
                startVideo={cameraRef ? startVideo : () => null}
                endVideo={endVideo}
                children={children}
              />
            ) : (
              <PictureControls takePicture={takePicture} children={children} />
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
