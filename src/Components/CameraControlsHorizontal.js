import React from 'react';
import {View, Platform, Text} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';

export default function CameraControlsHorizontal(props) {
  const {children, state, icons, cameraState} = props;
  console.log(cameraState);
  const {flash, isVideo, isRecording, frontCamera} = cameraState;
  const {screen_size, orientation} = state;

  const {cameraTop, cameraMiddle, cameraBottom} = children.children;

  const landscape_right = orientation === 'LANDSCAPE-RIGHT';
  const camera_controls_container_styles = {
    width: 60,
    height: screen_size.height,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0, 255, 0, 0.15)',
  };
  const bottom_controls_container_styles = {
    width: 60,
    height: screen_size.height,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 0, 255, 0.15)',
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

  console.log('CHILDREN', children.cameraBottom);
  return (
    <View style={horizontal_content_container}>
      <View style={topVoid} />

      <View style={styles.horizontal_row_select_event}>
        {cameraTop ? cameraTop : null}
      </View>

      <View style={styles.horizontal_gesture_controls}>
        {cameraMiddle ? cameraMiddle : null}
      </View>

      <View style={camera_controls_container_styles}>
        {!isRecording ? (
          <CameraSettings
            screen_size={screen_size}
            frontCamera={frontCamera}
            flash={flash}
            isVideo={isVideo}
            toggleVideoOrPicture={props.toggleVideoOrPicture}
            toggleCamera={props.toggleCamera}
            toggleFlash={props.toggleFlash}
            icons={icons}
          />
        ) : null}
      </View>

      <View style={styles.horizontal_row_recording_controls}>
        {isVideo ? children.videoControls : children.pictureControls}
      </View>

      <View style={bottom_controls_container_styles}>
        <View style={styles.camera_bottom_container}>
          {!isRecording ? <>{cameraBottom ? cameraBottom : null}</> : null}
        </View>
      </View>

      <View style={bottomVoid} />
    </View>
  );
}
