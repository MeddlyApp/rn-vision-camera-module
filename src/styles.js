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
    height: 100,
    width: window.width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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

  /******************** RENDER CAMERA ********************/
  action_btn: {
    height: 90,
    width: 90,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },

  camera_btn: {
    height: 60,
    width: 60,
    // borderColor: '#FFFFFF',
    // borderWidth: 3,
    // borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  //
  snap_btn: {
    height: 90,
    width: 90,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    borderRadius: 45,
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
    // backgroundColor: 'green',
  },
  stop_btn: {
    height: 90,
    width: 90,
    borderColor: '#FF0000',
    borderWidth: 3,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  no_device_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
