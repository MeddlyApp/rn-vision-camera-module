import React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import CameraSettings from './CameraSettings';
import RecordingTimer from './RecordingTimer';
import VideoControls from './VideoControls';

export default function CameraControls(props) {
  const {
    children,
    cameraState,
    sectionHeights,
    toggleVideoOrPicture,
    toggleCamera,
    toggleFlash,
    orientation,
  } = props;

  const {customComponents, controls} = children;
  const {isVideo, frontCamera, flash, isRecording} = cameraState;

  const cameraTop = customComponents ? customComponents.cameraTop : null;
  const cameraMiddle = customComponents ? customComponents.cameraMiddle : null;
  const cameraBottom = customComponents ? customComponents.cameraBottom : null;
  const icons = customComponents ? customComponents.icons : null;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width, orientation, sectionHeights);

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
        {isRecording ? (
          <RecordingTimer />
        ) : (
          <CameraSettings
            frontCamera={frontCamera}
            flash={flash}
            isVideo={isVideo}
            toggleVideoOrPicture={toggleVideoOrPicture}
            toggleCamera={toggleCamera}
            toggleFlash={toggleFlash}
            icons={icons ? icons : null}
          />
        )}
      </View>

      {/* Recording / Take Picture Controls */}
      <View style={styles.section_controls}>{controls}</View>

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

const stylesWithProps = (height, width, orientation, sectionHeights) => {
  const is_vertical = height > width;

  const is_portrait = orientation === 'PORTRAIT';
  const is_left = orientation === 'LANDSCAPE-LEFT';
  const is_right = orientation === 'LANDSCAPE-RIGHT';

  const customTopHeight =
    sectionHeights && sectionHeights.top ? sectionHeights.top : 100;
  const customBottomHeight =
    sectionHeights && sectionHeights.bottom ? sectionHeights.bottom : 100;

  const top = customTopHeight;
  const settings = 60;
  const controls = 140;
  const bottom = customBottomHeight;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: is_vertical ? 'column' : is_left ? 'row' : 'row-reverse',
    },

    section_top: {
      height: is_vertical ? top : height,
      width: is_vertical ? height : top,
      flexDirection: is_vertical ? 'row' : 'column',
    },

    section_gestures: {
      flex: 1,
      height: is_vertical ? null : height,
    },

    section_settings: {
      height: is_vertical ? settings : height,
      width: is_vertical ? height : settings,
      flexDirection: is_vertical
        ? 'row'
        : is_left
        ? 'column-reverse'
        : 'column',
    },

    section_controls: {
      height: is_vertical ? controls : height,
      width: is_vertical ? height : controls,
      flexDirection: is_vertical
        ? 'row'
        : is_left
        ? 'column-reverse'
        : 'column',
    },

    section_bottom: {
      height: is_vertical ? bottom : height,
      width: is_vertical ? height : bottom,
    },
  });
};
