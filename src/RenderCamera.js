import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

export default function RenderCamera(props) {
  let {camera, state} = props;
  let {front_camera} = state;

  let devices = useCameraDevices();
  let device = front_camera ? devices.front : devices.back;

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
