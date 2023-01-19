import {StyleSheet, useWindowDimensions} from 'react-native';

const {height, width} = useWindowDimensions();
const styles = StyleSheet.create({
  /******************** VISION CAMERA ********************/

  // Vertical Layout Formatting
  vertical_row_select_event: {
    height: 100,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  vertical_gesture_controls: {
    flex: 5,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 0, 0, 0.25)',
  },
  vertical_row_recording_controls: {
    height: 120,
    width: width,
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  vertical_bottom_void: {
    flex: 1,
    width: width,
  },

  // Horizontal Layout Formatting
  horizontal_row_select_event: {
    width: 100,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  horizontal_gesture_controls: {
    flex: 5,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 0, 0, 0.25)',
  },
  horizontal_row_recording_controls: {
    height: width,
    width: 120,
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  horizontal_top_void_right: {
    flex: 1,
    height: height,
  },
  horizontal_top_void_left: {
    flex: 0,
    height: height,
  },
  horizontal_bottom_void_left: {
    flex: 1,
    height: height,
  },
  horizontal_bottom_void_right: {
    flex: 0,
    height: height,
  },
});

export default styles;
