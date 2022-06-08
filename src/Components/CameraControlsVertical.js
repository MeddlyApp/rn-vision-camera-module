import React from 'react';
import {View, Text} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';

export default function CameraControlsVertical(props) {
  let {children, state, cameraState} = props;

  const {flash, isVideo, frontCamera} = cameraState;

  const {cameraTop, cameraMiddle, cameraBottom, icons} = children.children;
  const {screen_size, is_recording} = state;

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

  const recording_controls = {
    ...styles.vertical_row_recording_controls,
  };

  return (
    <View style={vertical_content_container}>
      <View style={styles.vertical_row_select_event}>
        {!is_recording ? <>{cameraTop ? cameraTop : null}</> : null}
      </View>
      <View style={styles.vertical_gesture_controls}>
        {!is_recording ? <>{cameraMiddle ? cameraMiddle : null}</> : null}
      </View>

      <View style={camera_controls_container_styles}>
        {!is_recording ? (
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
        ) : null}
      </View>

      <View style={recording_controls}>
        {isVideo ? children.videoControls : children.pictureControls}
      </View>

      <View style={bottom_controls_container_styles}>
        <View style={styles.camera_bottom_container}>
          {!is_recording ? <>{cameraBottom ? cameraBottom : null}</> : null}
        </View>
      </View>

      <View style={styles.vertical_bottom_void} />
    </View>
  );
}
