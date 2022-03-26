import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../styles';

export default function CameraSettings(props) {
  const {screen_size, front_camera, flash, is_video, icons} = props;
  const cameraView = front_camera ? 'Front' : 'Back';
  const is_vertical = screen_size.height > screen_size.width;

  const base_styles = {
    alignItems: 'center',
    justifyContent: 'center',
  };
  const vertical_styles = {
    ...base_styles,
    height: 80,
    width: screen_size.width / 3,
  };
  const horizontal_styles = {
    ...base_styles,
    width: 80,
    height: screen_size.height / 3,
  };

  const toggle_btn_style = is_vertical ? vertical_styles : horizontal_styles;

  const {flashIcons, viewPortIcon, togglePictureIcon, toggleVideoIcon} = icons;

  return (
    <>
      {/* Flash */}
      <View style={toggle_btn_style}>
        {cameraView === 'Front' ? null : (
          <TouchableOpacity
            onPress={props.toggleFlash}
            style={styles.camera_btn}>
            <>
              {flash === 'on' ? (
                <>
                  {flashIcons && flashIcons.flashOn ? (
                    flashIcons.flashOn
                  ) : (
                    <Text style={styles.txt_white}>On</Text>
                  )}
                </>
              ) : null}

              {flash === 'off' ? (
                <>
                  {flashIcons && flashIcons.flashOff ? (
                    flashIcons.flashOff
                  ) : (
                    <Text style={styles.txt_white}>Off</Text>
                  )}
                </>
              ) : null}

              {flash === 'auto' ? (
                <>
                  {flashIcons && flashIcons.flashAuto ? (
                    flashIcons.flashAuto
                  ) : (
                    <Text style={styles.txt_white}>Auto</Text>
                  )}
                </>
              ) : null}
            </>
          </TouchableOpacity>
        )}
      </View>

      {/* Camera Mode */}
      <View style={toggle_btn_style}>
        <TouchableOpacity
          onPress={props.toggleVideoOrPicture}
          style={styles.camera_btn}>
          {is_video ? (
            <>
              {toggleVideoIcon ? (
                toggleVideoIcon
              ) : (
                <Text style={styles.txt_white}>Video</Text>
              )}
            </>
          ) : (
            <>
              {togglePictureIcon ? (
                togglePictureIcon
              ) : (
                <Text style={styles.txt_white}>Picture</Text>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Viewport */}
      <View style={toggle_btn_style}>
        <TouchableOpacity
          onPress={props.toggleCamera}
          style={styles.camera_btn}>
          {cameraView === 'Front' ? (
            <>
              {viewPortIcon && viewPortIcon.frontCamera ? (
                viewPortIcon.frontCamera
              ) : (
                <Text style={styles.txt_white}>{cameraView}</Text>
              )}
            </>
          ) : (
            <>
              {viewPortIcon && viewPortIcon.backCamera ? (
                viewPortIcon.backCamera
              ) : (
                <Text style={styles.txt_white}>{cameraView}</Text>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}
