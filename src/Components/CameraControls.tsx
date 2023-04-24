import React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import {
  CameraCustomSection,
  CustomComponents,
  SectionHeights,
} from '../Interfaces';
import RecordingTimer from './RecordingTimer';

interface Props {
  children: {
    customComponents: CustomComponents;
    controls: JSX.Element;
  };
  isRecording: boolean;
  sectionHeights: SectionHeights;
  orientation: string;
}

export default function CameraControls(props: Props) {
  const {children, isRecording, sectionHeights, orientation} = props;

  const {customComponents, controls} = children;

  const cameraTop: CameraCustomSection | null | undefined = customComponents
    ? customComponents.cameraTop
    : null;
  const cameraMiddle: CameraCustomSection | null | undefined = customComponents
    ? customComponents.cameraMiddle
    : null;
  const cameraAboveControls: CameraCustomSection | null | undefined =
    customComponents ? customComponents.cameraAboveControls : null;
  const cameraBottom: CameraCustomSection | null | undefined = customComponents
    ? customComponents.cameraBottom
    : null;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width, orientation, sectionHeights);

  return (
    <SafeAreaView style={styles.container} pointerEvents="box-none">
      {/* Top Bar */}
      <View style={styles.section_top} pointerEvents="box-none">
        {isRecording
          ? null
          : cameraTop && cameraTop?.component
          ? cameraTop.component
          : null}
      </View>

      {/* Gesture Controls */}
      <View style={styles.section_gestures} pointerEvents="box-none">
        {isRecording
          ? null
          : cameraMiddle && cameraMiddle?.component
          ? cameraMiddle.component
          : null}
      </View>

      {/* Above Camera Controls */}
      <View style={styles.section_above_controls} pointerEvents="box-none">
        {isRecording ? (
          <RecordingTimer />
        ) : cameraAboveControls && cameraAboveControls?.component ? (
          cameraAboveControls.component
        ) : null}
      </View>

      {/* Recording / Take Picture Controls */}
      <View style={styles.section_controls} pointerEvents="box-none">
        {controls}
      </View>

      {/* Bottom Area */}
      <View style={styles.section_bottom} pointerEvents="box-none">
        {/* !isRecording
          ? cameraBottom && cameraBottom?.component
            ? cameraBottom.component
            : null
          : cameraBottom &&
            (cameraBottom?.component ? cameraBottom.component : null) */}

        {isRecording
          ? null
          : cameraBottom && cameraBottom?.component
          ? cameraBottom.component
          : null}
      </View>
    </SafeAreaView>
  );
}

const stylesWithProps = (
  height: number,
  width: number,
  orientation: string,
  sectionHeights: SectionHeights,
) => {
  const is_vertical: boolean = height > width;
  const is_left: boolean = orientation === 'LANDSCAPE-LEFT';

  const customTopHeight: number =
    sectionHeights && sectionHeights.top ? sectionHeights.top : 100;
  const customBottomHeight: number =
    sectionHeights && sectionHeights.bottom ? sectionHeights.bottom : 100;

  const top: number = customTopHeight;
  const settings = 60;
  const controls = 140;
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
      height: is_vertical ? undefined : height,
    },

    section_above_controls: {
      height: is_vertical ? settings : height,
      width: is_vertical ? height : settings,
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
