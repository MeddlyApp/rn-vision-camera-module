import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../styles';

export default function CameraSettings(props) {
  const {screen_size, front_camera, flash} = props;
  const cameraView = front_camera ? 'Front' : 'Back';
  const is_vertical = screen_size.height > screen_size.width;

  const base_styles = {
    alignItems: 'center',
    justifyContent: 'center',
  };
  const vertical_styles = {
    ...base_styles,
    height: 80,
    width: screen_size.width / 2,
  };
  const horizontal_styles = {
    ...base_styles,
    width: 80,
    height: screen_size.height / 2,
  };

  const toggle_btn_style = is_vertical ? vertical_styles : horizontal_styles;

  return (
    <>
      <View style={toggle_btn_style}>
        {cameraView === 'Front' ? null : (
          <TouchableOpacity
            onPress={props.toggleFlash}
            style={styles.camera_btn}>
            <Text style={styles.txt_white}>{flash}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={toggle_btn_style}>
        <TouchableOpacity
          onPress={props.toggleCamera}
          style={styles.camera_btn}>
          <Text style={styles.txt_white}>{cameraView}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
