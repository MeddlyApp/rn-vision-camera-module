import React from 'react';
import {View, Platform, Text} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';
import formatElapsedTime from '../../utilities/FormatElapsedTime';

export default function CameraControlsHorizontal(props) {
  const {children, state, cameraState} = props;
  const {flash, isVideo, frontCamera, isRecording} = cameraState;
  const {screen_size, orientation, recording_elapsed_time} = state;
  const {cameraTop, cameraMiddle, cameraBottom, icons} = children.children;
  const landscape_right = orientation === 'LANDSCAPE-RIGHT';

  const camera_controls_container_styles = {
    width: 60,
    height: screen_size.height,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const bottom_controls_container_styles = {
    width: 60,
    height: screen_size.height,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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

  const recording_controls = {
    ...styles.horizontal_row_recording_controls,
  };

  return (
    <View style={horizontal_content_container}>
      <View style={topVoid} />

      <View style={styles.horizontal_row_select_event}>
        {!isRecording || cameraTop.showWhileRecording
          ? cameraTop && cameraTop.component
            ? cameraTop.component
            : null
          : null}
      </View>

      <View style={styles.horizontal_gesture_controls}>
        {!isRecording || cameraMiddle.showWhileRecording
          ? cameraMiddle && cameraMiddle.component
            ? cameraMiddle.component
            : null
          : null}
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
            icons={icons ? icons : null}
          />
        ) : (
          <Text style={styles.recording_elapsed_time}>
            {formatElapsedTime(recording_elapsed_time)}
          </Text>
        )}
      </View>

      <View style={recording_controls}>
        {isVideo ? children.videoControls : children.pictureControls}
      </View>

      <View style={bottom_controls_container_styles}>
        <View style={styles.camera_bottom_container}>
          {!isRecording
            ? cameraBottom && cameraBottom.component
              ? cameraBottom.component
              : null
            : cameraBottom &&
              (cameraBottom.component && cameraBottom.showWhileRecording
                ? cameraBottom.component
                : null)}
        </View>
      </View>

      <View style={bottomVoid} />
    </View>
  );
}
