import React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import {CameraState, SectionHeights} from '../Interfaces';
import CameraSettings from './CameraSettings';
import RecordingTimer from './RecordingTimer';

interface Props {
  children: any;
  cameraState: CameraState;
  sectionHeights: SectionHeights;
  toggleVideoOrPicture: () => void;
  toggleCamera: () => void;
  toggleFlash: () => void;
  orientation: string;
}

export default function CameraControls(props: Props) {
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

  const cameraTop: any = customComponents ? customComponents.cameraTop : null;
  const cameraMiddle: any = customComponents
    ? customComponents.cameraMiddle
    : null;
  const cameraBottom: any = customComponents
    ? customComponents.cameraBottom
    : null;
  const icons: any = customComponents ? customComponents.icons : null;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width, orientation, sectionHeights);

  return (
    <SafeAreaView style={styles.container} pointerEvents="box-none">
      {/* Top Bar */}
      <View style={styles.section_top} pointerEvents="box-none">
        {!isRecording || cameraTop.showWhileRecording
          ? cameraTop && cameraTop.component
            ? cameraTop.component
            : null
          : null}
      </View>

      {/* Gesture Controls */}
      <View style={styles.section_gestures} pointerEvents="box-none">
        {!isRecording || cameraMiddle.showWhileRecording
          ? cameraMiddle && cameraMiddle.component
            ? cameraMiddle.component
            : null
          : null}
      </View>

      {/* Settings */}
      <View style={styles.section_settings} pointerEvents="box-none">
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
      <View style={styles.section_controls} pointerEvents="box-none">
        {controls}
      </View>

      {/* Bottom Area */}
      <View style={styles.section_bottom} pointerEvents="box-none">
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

const stylesWithProps = (
  height: any,
  width: number,
  orientation: string,
  sectionHeights: SectionHeights,
) => {
  const is_vertical: boolean = height > width;
  const is_portrait: boolean = orientation === 'PORTRAIT';
  const is_left: boolean = orientation === 'LANDSCAPE-LEFT';
  const is_right: boolean = orientation === 'LANDSCAPE-RIGHT';

  const customTopHeight: number =
    sectionHeights && sectionHeights.top ? sectionHeights.top : 100;
  const customBottomHeight: number =
    sectionHeights && sectionHeights.bottom ? sectionHeights.bottom : 100;

  const top: number = customTopHeight;
  const settings: number = 60;
  const controls: number = 140;
  const bottom: number = customBottomHeight;

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
