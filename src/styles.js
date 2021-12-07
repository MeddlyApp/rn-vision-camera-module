import {StyleSheet, Dimensions} from 'react-native';

let window = Dimensions.get('window');
const styles = StyleSheet.create({
  /******************** GENERAL ********************/

  base_container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  flex_1: {
    flex: 1,
  },
  txt_white: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  txt_white_margin_top: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 30,
  },

  /******************** VISION CAMERA ********************/

  permissions_content_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Vertical Layout Formatting
  vertical_row_select_event: {
    height: 145,
    width: window.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vertical_gesture_controls: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vertical_row_recording_controls: {
    height: 120,
    width: window.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vertical_bottom_void: {
    flex: 1,
    width: window.width,
  },

  // Horizontal Layout Formatting
  horizontal_row_select_event: {
    width: 145,
    height: window.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal_gesture_controls: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal_row_recording_controls: {
    width: 120,
    height: window.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal_bottom_void: {
    flex: 1,
    height: window.height,
  },

  /******************** RENDER CAMERA ********************/

  camera_btn: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rec_btn: {
    height: 90,
    width: 90,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stop_btn: {
    height: 90,
    width: 90,
    borderColor: '#FF0000',
    borderWidth: 3,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  no_device_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
