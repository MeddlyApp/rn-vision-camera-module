import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  NativeTouchEvent,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  Camera,
  CameraDevice,
  CameraDeviceFormat,
  CameraRuntimeError,
  Orientation,
  VideoStabilizationMode,
  useCameraDevices,
  useCameraFormat,
} from 'react-native-vision-camera';
import {
  GestureEventPayload,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import GestureHandler from './GestureHandler';
import {CameraConfig, CameraState} from '../Interfaces';

interface Props {
  cameraRef: any;
  frontCamera: boolean;
  isFocused: boolean;
  config: CameraConfig;
  cameraState: CameraState;
  orientation: Orientation;
  hideNoDeviceFound?: boolean;
  getDeviceInfo?: (val?: CameraDeviceFormat | undefined) => void;
  showTakePicIndicator: boolean;
  onSingleTap?: (val: GestureEventPayload) => void;
  onDoubleTap?: (val: GestureEventPayload) => void;
  swipeDistance?: number;
  onSwipeUp?: (val: NativeTouchEvent) => void;
  onSwipeDown?: (val: NativeTouchEvent) => void;
  onSwipeLeft?: (val: NativeTouchEvent) => void;
  onSwipeRight?: (val: NativeTouchEvent) => void;
  frameProcessor?: any; // FrameProcessor;
  locationPermission: boolean;
}

export default function RenderCamera(props: Props) {
  const {
    cameraRef,
    frontCamera,
    isFocused,
    config,
    cameraState,
    orientation,
    hideNoDeviceFound,
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
    locationPermission,
  } = props;

  const isPortrait = orientation.toLowerCase() === 'portrait';
  const isIos = Platform.OS === 'ios';

  const {height, width} = useWindowDimensions();
  const styles = styleWithProps(height, width, orientation);

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

  const devices: CameraDevice[] = useCameraDevices();
  const frontDevices: CameraDevice[] = devices.filter(
    (d: CameraDevice) => d.position === 'front',
  );
  const backDevices: CameraDevice[] = devices.filter(
    (d: CameraDevice) => d.position === 'back',
  );
  const device: CameraDevice = frontCamera ? frontDevices[1] : backDevices[0];
  // if (__DEV__) {
  //   console.log(JSON.stringify(device, (k, v) => (k === 'formats' ? [] : v), 2));
  // }

  const videoStabilizationMode: VideoStabilizationMode =
    cameraState && cameraState.videoStabilizationMode
      ? cameraState.videoStabilizationMode
      : 'auto' || 'off';

  const height1080 = !isIos && isPortrait ? 1920 : 1080;
  const width1080 = !isIos && isPortrait ? 1080 : 1920;

  const format = useCameraFormat(device, [
    {photoResolution: {width: width1080, height: height1080}},
    {videoResolution: {width: width1080, height: height1080}},
    {videoStabilizationMode: videoStabilizationMode},
    {fps: 30},
  ]);

  useEffect(() => {
    getDeviceInfo ? getDeviceInfo(format) : null;
  }, [format, device, getDeviceInfo]);

  const onError = (error: CameraRuntimeError) =>
    __DEV__ ? console.error(error) : null;
  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  // Additional Photo Values:
  //    autoFocusSystem, fieldOfView, photoHeight, photoWidth,
  //    pixelFormats, supportsPhotoHDR

  // Additional Video Values:
  //    minFps, maxFps, minIOS, maxISO, videoHeight, videoWidth

  // const supportsPhotoHDR = format?.supportsPhotoHdr;
  // const supportsVideoHDR = format?.supportsVideoHdr;
  // const videoHDRIsOn = cameraState.isVideo
  //   ? supportsVideoHDR
  //   : supportsPhotoHDR;

  const maxFps = format?.maxFps;
  const formatFPS = maxFps && maxFps > 30 ? 30 : maxFps;

  const showIosLandscape = !isPortrait && isIos;
  const cameraStyle = showIosLandscape
    ? styles.landscapeIos
    : StyleSheet.absoluteFill;

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
            style={cameraStyle}
            device={device}
            isActive={isFocused}
            onInitialized={onInitialized}
            onError={onError}
            enableZoomGesture={true}
            photo={config.photo}
            video={config.video}
            audio={config.video}
            enableLocation={locationPermission}
            videoStabilizationMode={videoStabilizationMode}
            resizeMode={showIosLandscape ? 'contain' : 'cover'} // "cover"
            format={format}
            orientation={'portrait'} // orientation
            fps={formatFPS}
            frameProcessor={frameProcessor}
          />
        </GestureHandler>
      )}

      {device == null && isCameraInitialized && !hideNoDeviceFound ? (
        <View style={styles.flex_centered}>
          <Text style={styles.txt_white}>No Device Found - Initalized</Text>
        </View>
      ) : null}

      {!isCameraInitialized && !hideNoDeviceFound ? (
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

const styleWithProps = (height: number, width: number, orientation: string) => {
  const isLeft = orientation.toLowerCase() === 'landscape-left';
  const isRight = orientation.toLowerCase() === 'landscape-right';

  const returnIosLandscapeTransform = () => {
    if (isLeft) return [{rotate: '-90deg'}];
    else if (isRight) return [{rotate: '90deg'}];
    return undefined;
  };

  return StyleSheet.create({
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

    landscapeIos: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      transform: returnIosLandscapeTransform(),
    },
  });
};
