import React, {useState, useEffect, useCallback, useMemo} from 'react';
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
  useCameraDevices,
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

  //const orientation = 'PORTRAIT';

  const isPortrait = orientation.toLowerCase() === 'portrait';
  const isIos = Platform.OS === 'ios';

  const {height, width} = useWindowDimensions();
  console.log({orientation});
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
  const device: CameraDevice = frontCamera ? frontDevices[0] : backDevices[0];

  const format: CameraDeviceFormat = useMemo(() => {
    //console.log('Orientation Updated:', isPortrait);

    // NOTE: with iOS, we must set the height and width
    //       specifically, depending on the orientation

    // We only want 1080p video and photo
    const filtered1080pFormats = device?.formats.filter(
      (format: CameraDeviceFormat) => {
        const height = !isIos && isPortrait ? 1920 : 1080;
        const width = !isIos && isPortrait ? 1080 : 1920;

        const formatVideoHeight = format.videoHeight;
        const formatVideoWidth = format.videoWidth;

        const videoIsHeight = formatVideoHeight === height;
        const videoIsWidth = formatVideoWidth === width;
        const videoIs1080 = videoIsHeight && videoIsWidth;

        const photoIsHeight = format.photoHeight === height;
        const photoIsWidth = format.photoWidth === width;
        const photoIs1080 = photoIsHeight && photoIsWidth;

        return isIos ? videoIs1080 : videoIs1080 && photoIs1080;
      },
    );

    if (filtered1080pFormats && filtered1080pFormats?.length > 0) {
      return filtered1080pFormats.reduce(
        (prev: CameraDeviceFormat, curr: CameraDeviceFormat) => {
          if (prev == null) return curr;
          // if (curr.maxFps > prev.maxFps) return curr;
          else return prev;
        },
      );
    }

    // If no 1080p, we only want 720p video and photo

    const filtered720pFormats = device?.formats.filter(
      (format: CameraDeviceFormat) => {
        const height = !isIos && isPortrait ? 1280 : 720;
        const width = !isIos && isPortrait ? 720 : 1280;

        const videoIsHeight = format.videoHeight === height;
        const videoIsWidth = format.videoWidth === width;
        const videoIs720 = videoIsHeight && videoIsWidth;

        const photoIsHeight = format.photoHeight === height;
        const photoIsWidth = format.photoWidth === width;
        const photoIs720 = photoIsHeight && photoIsWidth;

        return isIos ? videoIs720 : videoIs720 && photoIs720;
      },
    );

    if (filtered720pFormats && filtered720pFormats?.length > 0) {
      return filtered720pFormats.reduce(
        (prev: CameraDeviceFormat, curr: CameraDeviceFormat) => {
          if (prev == null) return curr;
          // if (curr.maxFps > prev.maxFps) return curr;
          else return prev;
        },
      );
    }

    // If no 1080 or 720, return the highest FPS

    return device?.formats.reduce(
      (prev: CameraDeviceFormat, curr: CameraDeviceFormat) => {
        if (prev == null) return curr;
        // if (curr.maxFps > prev.maxFps) return curr;
        else return prev;
      },
    );
  }, [device?.formats, orientation]);

  useEffect(() => {
    getDeviceInfo ? getDeviceInfo(format) : null;
  }, [format, device, getDeviceInfo]);

  const onError = (error: CameraRuntimeError) => console.error(error);
  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  const videoStabilizationMode =
    cameraState && cameraState.videoStabilizationMode
      ? cameraState.videoStabilizationMode
      : 'auto' || 'off';

  // Additional Photo Values:
  //    autoFocusSystem, fieldOfView, photoHeight, photoWidth,
  //    pixelFormats, supportsPhotoHDR

  // Additional Video Values:
  //    minFps, maxFps, minIOS, maxISO, videoHeight, videoWidth

  const videoStabilizationModes = format?.videoStabilizationModes;

  const supportsPhotoHDR = format?.supportsPhotoHdr;
  const supportsVideoHDR = format?.supportsVideoHdr;
  // const maxFps = format?.maxFps;

  const videoHDRIsOn = cameraState.isVideo
    ? supportsVideoHDR
    : supportsPhotoHDR;

  // const formatFPS = maxFps && maxFps > 30 ? 30 : maxFps;

  const showIosLandscape = !isPortrait && isIos;
  const cameraStyle = showIosLandscape
    ? styles.landscapeIos
    : StyleSheet.absoluteFill;

  //const isLeft = orientation.toLowerCase() === 'landscape-left';
  //const isRight = orientation.toLowerCase() === 'landscape-right';

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
            resizeMode={showIosLandscape ? 'contain' : 'cover'}
            //resizeMode="cover"
            format={format}
            orientation={'portrait'}
            // fps={formatFPS}
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
      height: height,
      width: width,
      transform: returnIosLandscapeTransform(),
    },
  });
};
