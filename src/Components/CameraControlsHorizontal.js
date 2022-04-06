import React from 'react';
import {View, Platform} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';

export default function CameraControlsHorizontal(props) {
  const {children, state, icons} = props;
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
    width: 60,
    height: screen_size.height,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 0, 0.15)',
  };
  const bottom_controls_container_styles = {
    width: 60,
    height: screen_size.height,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 255, 0.15)',
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

  const topVoid =
    landscape_right && Platform.OS === 'ios'
      ? styles.horizontal_top_void_right
      : styles.horizontal_top_void_left;

  const bottomVoid =
    landscape_right && Platform.OS === 'ios'
      ? styles.horizontal_bottom_void_right
      : styles.horizontal_bottom_void_left;

  return (
    <View style={horizontal_content_container}>
      <View style={topVoid} />

      <View style={styles.horizontal_row_select_event}>
        {children && children.children && children.children.cameraTop
          ? children.children.cameraTop
          : null}
      </View>

      <View style={styles.horizontal_gesture_controls}>
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

      <View style={styles.horizontal_row_recording_controls}>
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

      <View style={bottomVoid} />
    </View>
  );
}
