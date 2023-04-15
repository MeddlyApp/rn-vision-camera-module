import {StyleSheet, useWindowDimensions} from 'react-native';

const Styles = () => {
  const {height, width} = useWindowDimensions();

  return StyleSheet.create({
    /******************** VISION CAMERA ********************/

    // Vertical Layout Formatting
    vertical_row_select_event: {
      height: 100,
      width: width,
      alignItems: 'center',
      justifyContent: 'center',
    },
    vertical_gesture_controls: {
      flex: 5,
      width: width,
      alignItems: 'center',
      justifyContent: 'center',
    },
    vertical_row_recording_controls: {
      height: 120,
      width: width,
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
    },
    horizontal_gesture_controls: {
      flex: 5,
      height: height,
      alignItems: 'center',
      justifyContent: 'center',
    },
    horizontal_row_recording_controls: {
      height: width,
      width: 120,
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
};

const styles = Styles;
export default styles;
