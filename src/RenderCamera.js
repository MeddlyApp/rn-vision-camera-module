import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import styles from './styles';

export default function RenderCamera(props) {
  let {camera, camera_active, front_camera, is_video} = props;

  let devices = useCameraDevices();
  let device = front_camera ? devices.front : devices.back;

  if (device == null) {
    return (
      <View style={styles.no_device_container}>
        <Text style={styles.txt_white}>No Device Found</Text>
      </View>
    );
  } else {
    return (
      <Camera
        ref={camera}
        device={device}
        isActive={camera_active}
        video={is_video}
        audio={is_video}
        fps={240}
        style={StyleSheet.absoluteFill}
      />
    );
  }
}
