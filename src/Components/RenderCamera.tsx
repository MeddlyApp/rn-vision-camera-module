import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  NativeTouchEvent,
  useWindowDimensions,
} from 'react-native';
import {
  CameraDevice,
  CameraDeviceFormat,
  useCameraDevice,
  CameraRuntimeError,
  FrameProcessor,
  useCameraFormat,
} from 'react-native-vision-camera';
import {Orientation as RNVCOrientation} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {
  GestureEventPayload,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import GestureHandler from './GestureHandler';
import {CameraConfig, CameraState} from '../Interfaces';
import Orientation from 'react-native-orientation-locker';

interface Props {
  cameraRef: any; // React.RefObject<Camera>;
  frontCamera: boolean;
  isActive: boolean;
  config: CameraConfig;
  cameraState: CameraState;
  orientation: Orientation;
  getDeviceInfo?: (val?: CameraDeviceFormat | undefined) => void;
  showTakePicIndicator: boolean;
  onSingleTap?: (val: GestureEventPayload) => void;
  onDoubleTap?: (val: GestureEventPayload) => void;
  swipeDistance?: number;
  onSwipeUp?: (val: NativeTouchEvent) => void;
  onSwipeDown?: (val: NativeTouchEvent) => void;
  onSwipeLeft?: (val: NativeTouchEvent) => void;
  onSwipeRight?: (val: NativeTouchEvent) => void;
  frameProcessor?: FrameProcessor;
}

export default function RenderCamera(props: Props) {
  const {
    cameraRef,
    frontCamera,
    isActive,
    config,
    cameraState,
    orientation,
    getDeviceInfo,
    showTakePicIndicator,
    onSingleTap,
    onDoubleTap,
    swipeDistance,
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
    frameProcessor,
  } = props;

  const dimensions = useWindowDimensions();

  const {enableHdr, enableNightMode} = cameraState;
  const isPortrait = dimensions.height > dimensions.width;

  const tapToFocus = async ({
    nativeEvent,
  }: HandlerStateChangeEvent<Record<string, unknown>>) => {
    if (onSingleTap) onSingleTap(nativeEvent);

    if (cameraRef && cameraRef.current) {
      return await cameraRef?.current
        .focus({x: nativeEvent.absoluteX, y: nativeEvent.absoluteY})
        .catch(() => null);
    }
  };

  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);

  const device: CameraDevice | undefined = useCameraDevice(
    frontCamera ? 'front' : 'back',
  );

  const [targetFps, setTargetFps] = useState(30);

  // Bridge between react-native-orientation-locker and react-native-vision-camera
  let orient: RNVCOrientation = 'landscape-left';
  if (`${orientation}`.toLowerCase() === 'landscape-left') {
    orient = 'landscape-left';
  } else if (`${orientation}`.toLowerCase() === 'landscape-right') {
    orient = 'landscape-right';
  } else if (`${orientation}`.toLowerCase() === 'portrait') {
    orient = 'portrait';
  } else if (`${orientation}`.toLowerCase() === 'portrait-upside-down') {
    orient = 'portrait';
  }

  const landscapeMode = {height: 1920, width: 1080};
  const portraitMode = {height: 1080, width: 1920};
  const screenAspectRatio = dimensions.height / dimensions.width;

  // Can be {height, width} or "max"
  const resolution = isPortrait ? portraitMode : landscapeMode;
  const format = useCameraFormat(device, [
    {fps: targetFps},
    {videoResolution: resolution},
    // {videoAspectRatio: screenAspectRatio},
    {photoResolution: resolution},
    // {photoAspectRatio: screenAspectRatio},
  ]);

  //useEffect(() => {
  //  console.log('Fomat Updated:', {
  //    resolution,
  //    dimensions,
  //  });
  //}, [format, dimensions]);

  const videoStabilizationMode = 'cinematic-extended';
  const supportsVideoStabilization = format?.videoStabilizationModes.includes(
    videoStabilizationMode,
  );
  // console.log({maxFPS: format?.maxFps, device});
  const fps = Math.min(format?.maxFps ?? 1, targetFps);

  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = format?.supportsPhotoHDR;
  const canToggleNightMode = device?.supportsLowLightBoost ?? false;

  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, 10);

  useEffect(() => {
    getDeviceInfo ? getDeviceInfo(format) : null;
  }, [format, device, getDeviceInfo]);

  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  useEffect(() => {
    Camera.getMicrophonePermissionStatus().then(status =>
      setHasMicrophonePermission(status === 'granted'),
    );
  }, []);

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
        : undefined;
    console.log(`Camera: ${device?.name} | Format: ${f}`);
  }, [device?.name, format, fps]);

  const styles = stylesWithArgs(orient, dimensions);

  return (
    <View
      style={
        showTakePicIndicator
          ? [styles.container, styles.take_picture_indicator]
          : [styles.container]
      }
      pointerEvents="box-none">
      {device != null && (
        <GestureHandler
          onSingleTap={tapToFocus}
          onDoubleTap={onDoubleTap}
          swipeDistance={swipeDistance}
          onSwipeUp={onSwipeUp}
          onSwipeDown={onSwipeDown}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={isActive}
            onInitialized={onInitialized}
            // orientation={orient}
            onError={onError}
            enableZoomGesture={true}
            photo={config.photo}
            video={config.video}
            audio={hasMicrophonePermission}
            format={format}
            fps={fps}
            hdr={enableHdr}
            lowLightBoost={canToggleNightMode && enableNightMode}
            videoStabilizationMode={
              supportsVideoStabilization ? videoStabilizationMode : undefined
            }
            // frameProcessor={frameProcessor}
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
          swipeDistance={swipeDistance}
          onSwipeUp={onSwipeUp}
          onSwipeDown={onSwipeDown}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}>
          <View style={styles.flex_centered}>
            <Text style={styles.txt_white}>No Device Found</Text>
          </View>
        </GestureHandler>
      ) : null}
    </View>
  );
}

const stylesWithArgs = (orientation: string, dimensions: any) => {
  const isLandscapeLeft = orientation.toLowerCase() === 'landscape-left';
  const isLandscapeRight = orientation.toLowerCase() === 'landscape-right';
  const isLandscape = isLandscapeLeft || isLandscapeRight;

  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 2,
      bottom: 2,
      left: 2,
      right: 2,
      height: dimensions.height - 4,
      width: dimensions.width - 4,
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 2,
      // This is a hack to get the camera to rotate properly
      // rnvc orientation is broken...
      //transform: isLandscape
      //  ? [isLandscapeRight ? {rotate: '90deg'} : {rotate: '-90deg'}]
      //  : [{rotate: '0deg'}],
    },

    camera: {
      height: dimensions.height - 8,
      width: dimensions.width - 8,
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
};
