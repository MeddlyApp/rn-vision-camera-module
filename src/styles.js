import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  /******************** GENERAL ********************/

  txt_white: {
    fontWeight: '700',
    color: '#FFF',
  },
  txt_white_margin_top: {
    fontWeight: '700',
    color: '#FFF',
    marginTop: 30,
  },

  /******************** VISION CAMERA ********************/

  base_container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissions_content_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Vertical Layout Formatting
  vert_content_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vert_row_top: {
    flex: 6,
    width: '100%',
  },
  vert_row_middle_top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
  },
  vert_row_middle_bottom: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  vert_row_bottom: {
    flex: 0.5,
    width: '100%',
    flexDirection: 'row',
  },
  toggle_btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  /******************** RENDER CAMERA ********************/

  no_device_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
