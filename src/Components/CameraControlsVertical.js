import React from 'react';
import {View} from 'react-native';
import CameraSettings from './CameraSettings';
import styles from '../styles';
import RecordingTimer from './RecordingTimer';

export default function CameraControlsVertical(props) {
  const {children, cameraState, screenSize, orientation} = props;

  const {isVideo, frontCamera, flash, isRecording} = cameraState;
  const {cameraTop, cameraMiddle, cameraBottom, icons} = children.children;

  const camera_controls_container_styles = {
    height: 60,
    width: screenSize.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const bottom_controls_container_styles = {
    height: 60,
    width: screenSize.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const vertical_content_container = {
    height: screenSize.height,
    width: screenSize.width,
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
            screenSize={screenSize}
            frontCamera={frontCamera}
            flash={flash}
            isVideo={isVideo}
            toggleVideoOrPicture={props.toggleVideoOrPicture}
            toggleCamera={props.toggleCamera}
            toggleFlash={props.toggleFlash}
            icons={icons ? icons : null}
          />
        ) : (
          <RecordingTimer />
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
