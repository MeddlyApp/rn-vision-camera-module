import React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import CameraSettings from './CameraSettings';
import RecordingTimer from './RecordingTimer';

export default function CameraControls(props) {
  const {
    customComponents,
    cameraState,
    toggleVideoOrPicture,
    toggleCamera,
    toggleFlash,
    orientation,
  } = props;
  const {isVideo, frontCamera, flash, isRecording} = cameraState;

  const cameraTop = customComponents ? customComponents.cameraTop : null;
  const cameraMiddle = customComponents ? customComponents.cameraBottom : null;
  const cameraBottom = customComponents ? customComponents.cameraBottom : null;
  const icons = customComponents ? customComponents.icons : null;
  const videoControls = customComponents
    ? customComponents.videoControls
    : null;
  const pictureControls = customComponents
    ? customComponents.pictureControls
    : null;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width, orientation);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.section_top}>
        {!isRecording || cameraTop.showWhileRecording
          ? cameraTop && cameraTop.component
            ? cameraTop.component
            : null
          : null}
      </View>

      {/* Gesture Controls */}
      <View style={styles.section_gestures}>
        {!isRecording || cameraMiddle.showWhileRecording
          ? cameraMiddle && cameraMiddle.component
            ? cameraMiddle.component
            : null
          : null}
      </View>

      {/* Settings */}
      <View style={styles.section_settings}>
        {!isRecording ? (
          <CameraSettings
            frontCamera={frontCamera}
            flash={flash}
            isVideo={isVideo}
            toggleVideoOrPicture={toggleVideoOrPicture}
            toggleCamera={toggleCamera}
            toggleFlash={toggleFlash}
            icons={icons ? icons : null}
          />
        ) : (
          <RecordingTimer />
        )}
      </View>

      {/* Recording / Take Picture Controls */}
      <View style={styles.section_controls}>
        {isVideo ? videoControls : pictureControls}
      </View>

      {/* Bottom Area */}
      <View style={styles.section_bottom}>
        {!isRecording
          ? cameraBottom && cameraBottom.component
            ? cameraBottom.component
            : null
          : cameraBottom &&
            (cameraBottom.component && cameraBottom.showWhileRecording
              ? cameraBottom.component
              : null)}
      </View>
    </SafeAreaView>
  );
}

const stylesWithProps = (height, width, orientation) => {
  const is_vertical = height > width;

  const is_portrait = orientation === 'PORTRAIT';
  const is_left = orientation === 'LANDSCAPE-LEFT';
  const is_right = orientation === 'LANDSCAPE-RIGHT';

  const top = 100;
  const settings = 60;
  const controls = 140;
  const bottom = 60;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: is_vertical ? 'column' : 'row',
    },

    section_top: {
      height: is_vertical ? top : height,
      width: is_vertical ? height : top,
      backgroundColor: 'pink',
    },

    section_gestures: {
      flex: 1,
      height: is_vertical ? null : height,
      backgroundColor: 'purple',
    },

    section_settings: {
      height: is_vertical ? settings : height,
      width: is_vertical ? height : settings,
      backgroundColor: 'yellow',
    },

    section_controls: {
      height: is_vertical ? controls : height,
      width: is_vertical ? height : controls,
      backgroundColor: 'green',
    },

    section_bottom: {
      height: is_vertical ? bottom : height,
      width: is_vertical ? height : bottom,
      backgroundColor: 'red',
    },
  });
};
