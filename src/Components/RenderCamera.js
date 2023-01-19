import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {sortFormats, useCameraDevices} from 'react-native-vision-camera';
import {Camera, frameRateIncluded} from 'react-native-vision-camera';
import {useIsForeground} from '../hooks/useIsForeground';
import GestureHandler from './GestureHandler';

export default function RenderCamera(props: any) {
  const {
    cameraRef,
    frontCamera,
    zoomValue,
    setZoomValue,
    config,
    cameraState,
    getDeviceInfo,
    showTakePicIndicator,
  } = props;

  const tapToFocus = async ({nativeEvent}) => {
    if (cameraRef && cameraRef.current) {
      return await cameraRef.current
        .focus({x: nativeEvent.absoluteX, y: nativeEvent.absoluteY})
        .catch(e => null);
    }
  };

  const onPinchStart = () => (_prevPinch = 1);
  const onPinchEnd = () => (_prevPinch = 1);
  const onPinchProgress = p => {
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
  const devices = useCameraDevices();
  const device = devices[frontCamera ? 'front' : 'back'];
  const formats = useMemo(() => {
    if (device) {
      if (device.formats == null) return [];
      return device.formats.sort(sortFormats);
    } else return [];
  }, [device]);

  // need to get devices info and send it back to the front end
  //
  // getCameraOptions
  // currentCamera

  const [enableHdr, setEnableHdr] = useState(false);
  const [enableNightMode, setEnableNightMode] = useState(false);
  const [is60Fps, setIs60Fps] = useState(true);

  useEffect(() => {
    getDeviceInfo ? getDeviceInfo(device) : null;
  }, [
    device && device.supportsLowLightBoost
      ? device.supportsLowLightBoost
      : false,
    enableHdr,
    enableNightMode,
    formats,
    is60Fps,
  ]);

  const getFPS = () => {
    const configLessThan30 = config && config.fps && config.fps < 30;
    if (!is60Fps) {
      if (configLessThan30) return config.fps;
      return 30;
    }

    // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
    if (enableNightMode && !device.supportsLowLightBoost) {
      if (configLessThan30) return config.fps;
      return 30;
    }

    const supportsHdrAt60Fps = formats.some(
      f =>
        f.supportsVideoHDR &&
        f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
    );

    // User has enabled HDR, but HDR is not supported at 60 FPS.
    if (enableHdr && !supportsHdrAt60Fps) {
      if (configLessThan30) return config.fps;
      return 30;
    }

    const supports60Fps = formats.some(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
    );

    // 60 FPS is not supported by any format.
    if (!supports60Fps) {
      if (configLessThan30) return config.fps;
      return 30;
    }

    const result = config && config.fps ? config.fps : 30;
    return result;
  };

  const fps = useMemo(getFPS, [
    device && device.supportsLowLightBoost
      ? device.supportsLowLightBoost
      : false,
    enableHdr,
    enableNightMode,
    formats,
    is60Fps,
  ]);

  /*/ Additional stuff for testing if device supports features...
  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  const supportsFlash = device && device.hasFlash ? true : false;
  const supportsHdr = useMemo(
    () => formats.some(f => f.supportsVideoHDR || f.supportsPhotoHDR),
    [formats],
  );
  const supports60Fps = useMemo(
    () =>
      formats.some(f =>
        f.frameRateRanges.some(rate => frameRateIncluded(rate, 60)),
      ),
    [formats],
  );
  const canToggleNightMode = enableNightMode
    ? true // it's enabled so you have to be able to turn it off again
    : ((device && device?.supportsLowLightBoost) ?? false) || fps > 30; // either we have native support, or we can lower the FPS
  */

  /*
  // Galaxy S10 5G Bug: this selects a good device, but it only captures 1x1 ratio photos?
  const format = useMemo(() => {
    let availableFormats = formats;
    // console.log('Available Formats #0:', availableFormats.length);
    // Remove all formats with square photos
    availableFormats = availableFormats.filter(
      f => f.photoWidth === f.photoHeight,
    );
    // console.log('Available Formats #1:', availableFormats.length);
    if (enableHdr) {
      availableFormats = availableFormats.filter(
        f => f.supportsVideoHDR || f.supportsPhotoHDR,
      );
    }
    // console.log('Available Formats #2:', availableFormats.length);
    const res = availableFormats.find(f => {
      return f.frameRateRanges.some(r => frameRateIncluded(r, fps));
    });
    return res;
  }, [formats, fps, enableHdr]);
  */

  const onError = error => console.error(error);
  const onInitialized = () => setIsCameraInitialized(true);

  useEffect(() => {
    Camera.getMicrophonePermissionStatus().then(status =>
      setHasMicrophonePermission(status === 'authorized'),
    );
  }, []);

  /*
  if (device != null && format != null) {
    console.log(
      `Re-rendering camera page with ${
        isActive ? 'active' : 'inactive'
      } camera. ` +
        `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`,
    );
  } else {
    console.log('re-rendering camera page without active camera');
  }
  */

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
          onDoubleTap={props.onDoubleTap}
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          onPinchProgress={onPinchProgress}
          swipeDistance={props.swipeDistance}
          onSwipeUp={props.onSwipeUp}
          onSwipeDown={props.onSwipeDown}
          onSwipeLeft={props.onSwipeLeft}
          onSwipeRight={props.onSwipeRight}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            // format={format}
            fps={fps}
            hdr={enableHdr}
            lowLightBoost={device.supportsLowLightBoost && enableNightMode}
            isActive={isActive}
            onInitialized={onInitialized}
            onError={onError}
            // enableZoomGesture={false}
            zoom={zoom}
            preset={
              cameraState && cameraState.preset ? cameraState.preset : 'high'
            }
            photo={config.photo}
            video={config.video}
            audio={hasMicrophonePermission}
            videoStabilizationMode={
              cameraState && cameraState.videoStabilizationMode
                ? cameraState.videoStabilizationMode
                : 'auto' || 'off'
            }
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
          onDoubleTap={props.onDoubleTap}
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          onPinchProgress={onPinchProgress}
          swipeDistance={props.swipeDistance}
          onSwipeUp={props.onSwipeUp}
          onSwipeDown={props.onSwipeDown}
          onSwipeLeft={props.onSwipeLeft}
          onSwipeRight={props.onSwipeRight}>
          <View style={styles.flex_centered}>
            {/* <Text style={styles.txt_white}>Not Initialized</Text> */}
          </View>
        </GestureHandler>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
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

  txt_white: {
    color: '#FFF',
  },
});
