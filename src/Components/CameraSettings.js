import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../styles';

export default function CameraSettings(props) {
  const {screen_size, frontCamera, flash, isVideo, icons} = props;
  const cameraView = frontCamera ? 'Front' : 'Back';
  const is_vertical = screen_size.height > screen_size.width;

  const base_styles = {
    alignItems: 'center',
    justifyContent: 'center',
  };
  const vertical_styles = {
    ...base_styles,
    height: 50,
    width: screen_size.width / 2,
  };
  const horizontal_styles = {
    ...base_styles,
    width: 50,
    height: screen_size.height / 2,
  };

  const toggle_btn_style = is_vertical ? vertical_styles : horizontal_styles;

  let flashIcons,
    togglePictureIcon,
    toggleVideoIcon = null;
  if (icons) {
    flashIcons = icons.flashIcons;
    togglePictureIcon = icons.togglePictureIcon;
    toggleVideoIcon = icons.toggleVideoIcon;
  }

  return (
    <>
      {/* Flash */}
      <View style={toggle_btn_style}>
        {cameraView === 'Front' ? null : (
          <TouchableOpacity
            onPress={props.toggleFlash}
            style={styles.camera_action_btn}>
            <>
              {flash === 'on' ? (
                flashIcons && flashIcons.flashOn ? (
                  flashIcons.flashOn
                ) : (
                  <View>
                    <Text style={styles.txt_white}>On</Text>
                  </View>
                )
              ) : null}

              {flash === 'off' ? (
                flashIcons && flashIcons.flashOff ? (
                  flashIcons.flashOff
                ) : (
                  <View>
                    <Text style={styles.txt_white}>Off</Text>
                  </View>
                )
              ) : null}

              {flash === 'auto' ? (
                flashIcons && flashIcons.flashAuto ? (
                  flashIcons.flashAuto
                ) : (
                  <View>
                    <Text style={styles.txt_white}>Auto</Text>
                  </View>
                )
              ) : null}
            </>
          </TouchableOpacity>
        )}
      </View>

      {/* Camera Mode */}
      <View style={toggle_btn_style}>
        <TouchableOpacity
          onPress={props.toggleVideoOrPicture}
          style={styles.camera_action_btn}>
          {isVideo ? (
            toggleVideoIcon ? (
              toggleVideoIcon
            ) : (
              <View>
                <Text style={styles.txt_white}>Video</Text>
              </View>
            )
          ) : togglePictureIcon ? (
            togglePictureIcon
          ) : (
            <View>
              <Text style={styles.txt_white}>Picture</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}
