import React from 'react';
import {View, Text} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';

export default function CameraControlsVertical(props) {
  const {children, state} = props;
  const {is_recording, screen_size, front_camera, flash} = state;

  const camera_controls_container_styles = {
    height: 80,
    width: window.width,
    flexDirection: 'row',
  };
  const vertical_content_container = {
    height: screen_size.height,
    width: screen_size.width,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={vertical_content_container}>
      <View style={styles.vertical_row_select_event}>
        <Text style={styles.txt_white}>Event_Ctl</Text>
      </View>

      <View style={styles.vertical_gesture_controls}></View>

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

      <View style={styles.vertical_row_recording_controls}>{children}</View>

      <View style={styles.vertical_bottom_void} />
    </View>
  );
}
