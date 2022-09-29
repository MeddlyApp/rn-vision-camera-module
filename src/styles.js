import {StyleSheet, Dimensions} from 'react-native';

let window = Dimensions.get('window');
const styles = StyleSheet.create({
  /******************** VISION CAMERA ********************/

  // Vertical Layout Formatting
  vertical_row_select_event: {
    height: 100,
    width: window.width,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  vertical_gesture_controls: {
    flex: 5,
    width: window.width,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 0, 0, 0.25)',
  },
  vertical_row_recording_controls: {
    height: 120,
    width: window.width,
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  vertical_bottom_void: {
    flex: 1,
    width: window.width,
  },

  // Horizontal Layout Formatting
  horizontal_row_select_event: {
    width: 100,
    height: window.height,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  horizontal_gesture_controls: {
    flex: 5,
    height: window.height,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 0, 0, 0.25)',
  },
  horizontal_row_recording_controls: {
    height: window.width,
    width: 120,
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  horizontal_top_void_right: {
    flex: 1,
    height: window.height,
  },
  horizontal_top_void_left: {
    flex: 0,
    height: window.height,
  },
  horizontal_bottom_void_left: {
    flex: 1,
    height: window.height,
  },
  horizontal_bottom_void_right: {
    flex: 0,
    height: window.height,
  },
});

export default styles;
