import React from 'react';
import {View} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';

export default function CameraControlsVertical(props) {
  const {children, state, icons} = props;
  const {is_recording, screen_size, front_camera, flash, is_video} = state;

  const camera_controls_container_styles = {
    height: 60,
    width: window.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 0, 0.15)',
  };
  const bottom_controls_container_styles = {
    height: 60,
    width: window.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 255, 0.15)',
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
        {children && children.children && children.children.cameraTop
          ? children.children.cameraTop
          : null}
      </View>
      <View style={styles.vertical_gesture_controls}>
        {children && children.children && children.children.cameraMiddle
          ? children.children.cameraMiddle
          : null}
      </View>

      <View style={camera_controls_container_styles}>
        {!is_recording ? (
          <CameraSettings
            screen_size={screen_size}
            front_camera={front_camera}
            flash={flash}
            is_video={is_video}
            toggleVideoOrPicture={props.toggleVideoOrPicture}
            toggleCamera={props.toggleCamera}
            toggleFlash={props.toggleFlash}
            icons={icons}
          />
        ) : null}
      </View>

      <View style={styles.vertical_row_recording_controls}>
        {is_video ? children.videoControls : children.pictureControls}
      </View>

      <View style={bottom_controls_container_styles}>
        {!is_recording ? (
          <CameraSettings
            screen_size={screen_size}
            front_camera={front_camera}
            flash={flash}
            is_video={is_video}
            toggleVideoOrPicture={props.toggleVideoOrPicture}
            toggleCamera={props.toggleCamera}
            toggleFlash={props.toggleFlash}
            icons={icons}
          />
        ) : null}
      </View>

      <View style={styles.vertical_bottom_void} />
    </View>
  );
}
