import React from 'react';
import {View, Text} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';

export default function CameraControlsVertical(props) {
  let {children, state, icons, cameraState} = props;

  const {flash, isVideo, isRecording, frontCamera} = cameraState;

  const {cameraTop, cameraMiddle, cameraBottom} = children.children;
  const {screen_size} = state;

  const camera_controls_container_styles = {
    height: 60,
    width: screen_size.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0, 255, 0, 0.15)',
  };
  const bottom_controls_container_styles = {
    height: 60,
    width: screen_size.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 0, 255, 0.15)',
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
        {cameraTop ? cameraTop : null}
      </View>
      <View style={styles.vertical_gesture_controls}>
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

      <View style={styles.vertical_row_recording_controls}>
        {isVideo ? children.videoControls : children.pictureControls}
      </View>

      <View style={bottom_controls_container_styles}>
        <View style={styles.camera_bottom_container}>
          {!isRecording ? <>{cameraBottom ? cameraBottom : null}</> : null}
        </View>
      </View>

      <View style={styles.vertical_bottom_void} />
    </View>
  );
}
