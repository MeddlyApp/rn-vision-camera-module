import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

export default function RenderCamera(props) {
  let {camera, state} = props;
  let {front_camera} = state;

  let devices = useCameraDevices();
  let device = front_camera ? devices.front : devices.back;

  /*
  let onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
    },
  });
  */

  if (device == null) {
    return (
      <View style={styles.content_container}>
        <Text style={styles.txt_white}>No Device Found</Text>
      </View>
    );
  } else {
    return (
      <Camera
        ref={camera}
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        fps={240}
      />
    );
  }
}

const styles = StyleSheet.create({
  content_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_white: {
    fontWeight: '700',
    color: '#FFF',
  },
});
