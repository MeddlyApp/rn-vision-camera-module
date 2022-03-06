import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';

export default function CameraControlsHorizontal(props) {
  const {children, state} = props;
  const {
    is_recording,
    screen_size,
    orientation,
    front_camera,
    flash,
    is_video,
  } = state;

  const landscape_right = orientation === 'LANDSCAPE-RIGHT';
  const camera_controls_container_styles = {
    width: 80,
    height: screen_size.height,
    flexDirection: 'column',
  };

  let horizontal_content_container = {
    height: screen_size.height,
    width: screen_size.width,
    alignItems: 'center',
    justifyContent: 'center',
  };
  if (landscape_right) {
    horizontal_content_container = {
      ...horizontal_content_container,
      flexDirection: 'row-reverse',
    };
  } else {
    horizontal_content_container = {
      ...horizontal_content_container,
      flexDirection: 'row',
    };
  }

  return (
    <View style={horizontal_content_container}>
      <View style={styles.horizontal_row_select_event}>
        <TouchableOpacity onPress={props.toggleVideoOrPicture}>
          <Text style={styles.txt_white}>{is_video ? 'Video' : 'Picture'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horizontal_gesture_controls}></View>

      <View style={camera_controls_container_styles}>
        {!is_recording ? (
          <CameraSettings
            screen_size={screen_size}
            front_camera={front_camera}
            flash={flash}
            toggleCamera={props.toggleCamera}
            toggleFlash={props.toggleFlash}
          />
        ) : null}
      </View>

      <View style={styles.horizontal_row_recording_controls}>{children}</View>

      <View style={styles.horizontal_bottom_void} />
    </View>
  );
}