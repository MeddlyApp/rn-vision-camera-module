import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, NativeTouchEvent} from 'react-native';
import {
  CameraDevice,
  CameraDevices,
  CameraRuntimeError,
  useCameraDevices,
} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {
  GestureEventPayload,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import {useIsForeground} from '../hooks/useIsForeground';
import GestureHandler from './GestureHandler';
import {CameraConfig, CameraState} from '../Interfaces';

interface Props {
  cameraRef: any;
  frontCamera: boolean;
  zoomValue: number;
  setZoomValue: (zoomValue: number) => void;
  config: CameraConfig;
  cameraState: CameraState;
  getDeviceInfo?: (val: CameraDevice | undefined) => void;
  showTakePicIndicator: boolean;
  onDoubleTap?: (val: GestureEventPayload) => void;
  swipeDistance?: number;
  onSwipeUp?: (val: NativeTouchEvent) => void;
  onSwipeDown?: (val: NativeTouchEvent) => void;
  onSwipeLeft?: (val: NativeTouchEvent) => void;
  onSwipeRight?: (val: NativeTouchEvent) => void;
}

export default function RenderCamera(props: Props) {
  const {
    cameraRef,
    frontCamera,
    zoomValue,
    setZoomValue,
    config,
    cameraState,
    getDeviceInfo,
    showTakePicIndicator,
    //
    onDoubleTap,
    swipeDistance,
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
  } = props;

  const tapToFocus = async ({
    nativeEvent,
  }: HandlerStateChangeEvent<Record<string, unknown>>) => {
    if (cameraRef && cameraRef.current) {
      return await cameraRef.current
        .focus({x: nativeEvent.absoluteX, y: nativeEvent.absoluteY})
        .catch(() => null);
    }
  };

  let _prevPinch = 1;
  const onPinchStart = () => (_prevPinch = 1);
  const onPinchEnd = () => (_prevPinch = 1);
  const onPinchProgress = (p: number) => {
    const increment = 0.01;
    const p2 = p - _prevPinch;

    if (p2 > 0 && p2 > increment) {
      _prevPinch = p;
      const newZoom = Math.min(zoomValue + increment, 1);
      setZoomValue(newZoom);
    } else if (p2 < 0 && p2 < -increment) {
      _prevPinch = p;
      const newZoom = Math.max(zoomValue - increment * 1.5, 0);
      setZoomValue(newZoom);
    }
  };

  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);

  // check if camera page is active
  // const isFocussed = useIsFocused();
  const isFocussed = true;
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  // Camera Format Settings
  const devices: CameraDevices = useCameraDevices();
  const device = devices[frontCamera ? 'front' : 'back'];

  useEffect(() => {
    getDeviceInfo ? getDeviceInfo(device) : null;
  }, [device, getDeviceInfo]);

  const onError = (error: CameraRuntimeError) => console.error(error);
  const onInitialized = () => setIsCameraInitialized(true);

  useEffect(() => {
    Camera.getMicrophonePermissionStatus().then(status =>
      setHasMicrophonePermission(status === 'authorized'),
    );
  }, []);

  const cameraPreset =
    cameraState && cameraState?.preset ? cameraState.preset : 'high';

  const videoStabilizationMode =
    cameraState && cameraState.videoStabilizationMode
      ? cameraState.videoStabilizationMode
      : 'auto' || 'off';

  const zoom = zoomValue * 10; // multiplied by 10 because 1 is minimum

  return (
    <View
      style={
        showTakePicIndicator
          ? [styles.container, styles.take_picture_indicator]
          : [styles.container]
      }>
      {device != null && (
        <GestureHandler
          onSingleTap={tapToFocus}
          onDoubleTap={onDoubleTap}
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          onPinchProgress={onPinchProgress}
          swipeDistance={swipeDistance}
          onSwipeUp={onSwipeUp}
          onSwipeDown={onSwipeDown}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            onInitialized={onInitialized}
            onError={onError}
            zoom={zoom}
            preset={cameraPreset}
            photo={config.photo}
            video={config.video}
            audio={hasMicrophonePermission}
            videoStabilizationMode={videoStabilizationMode}
          />
        </GestureHandler>
      )}

      {device == null && isCameraInitialized ? (
        <View style={styles.flex_centered}>
          <Text style={styles.txt_white}>No Device Found</Text>
        </View>
      ) : null}

      {!isCameraInitialized ? (
        <GestureHandler
          onSingleTap={tapToFocus}
          onDoubleTap={onDoubleTap}
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          onPinchProgress={onPinchProgress}
          swipeDistance={swipeDistance}
          onSwipeUp={onSwipeUp}
          onSwipeDown={onSwipeDown}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}>
          <View style={styles.flex_centered} />
        </GestureHandler>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 2,
  },

  take_picture_indicator: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },

  flex_centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txt_white: {color: '#FFF'},
});
