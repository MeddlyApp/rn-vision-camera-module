import React from 'react';
import {View, Text} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';
import formatElapsedTime from '../../utilities/FormatElapsedTime';

export default function CameraControlsVertical(props) {
  let {children, state, cameraState} = props;
  const {flash, isVideo, frontCamera, isRecording} = cameraState;
  const {cameraTop, cameraMiddle, cameraBottom, icons} = children.children;
  const {screen_size, recording_elapsed_time} = state;

  const camera_controls_container_styles = {
    height: 60,
    width: screen_size.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const bottom_controls_container_styles = {
    height: 60,
    width: screen_size.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const vertical_content_container = {
    height: screen_size.height,
    width: screen_size.width,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const recording_controls = {
    ...styles.vertical_row_recording_controls,
  };

  return (
    <View style={vertical_content_container}>
      <View style={styles.vertical_row_select_event}>
        {!isRecording || cameraTop.showWhileRecording
          ? cameraTop && cameraTop.component
            ? cameraTop.component
            : null
          : null}
      </View>
      <View style={styles.vertical_gesture_controls}>
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
          {!isRecording || cameraBottom.showWhileRecording
            ? cameraBottom && cameraBottom.component
              ? cameraBottom.component
              : null
            : null}
        </View>
      </View>

      <View style={styles.vertical_bottom_void} />
    </View>
  );
}
