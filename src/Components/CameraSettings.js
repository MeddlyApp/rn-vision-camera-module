import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

export default function CameraSettings(props) {
  const {frontCamera, flash, isVideo, icons} = props;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width);

  const flashIcons = icons ? icons.flashIcons : null;
  const togglePictureIcon = icons ? icons.togglePictureIcon : null;
  const toggleVideoIcon = icons ? icons.toggleVideoIcon : null;

  const cameraView = frontCamera ? 'Front' : 'Back';

  return (
    <>
      {/* Flash */}
      <View>
        {cameraView === 'Front' ? null : (
          <TouchableOpacity
            onPress={props.toggleFlash}
            style={styles.camera_action_btn}>
            <>
              {flash === 'on' ? (
                flashIcons && flashIcons.flashOn ? (
                  flashIcons.flashOn
                ) : (
                  <View style={[styles.flex_centered]}>
                    <Text style={styles.txt_white}>On</Text>
                  </View>
                )
              ) : null}

              {flash === 'off' ? (
                flashIcons && flashIcons.flashOff ? (
                  flashIcons.flashOff
                ) : (
                  <View style={[styles.flex_centered]}>
                    <Text style={styles.txt_white}>Off</Text>
                  </View>
                )
              ) : null}

              {flash === 'auto' ? (
                flashIcons && flashIcons.flashAuto ? (
                  flashIcons.flashAuto
                ) : (
                  <View style={[styles.flex_centered]}>
                    <Text style={styles.txt_white}>Auto</Text>
                  </View>
                )
              ) : null}
            </>
          </TouchableOpacity>
        )}
      </View>

      {/* Camera Mode */}
      <View>
        <TouchableOpacity
          onPress={props.toggleVideoOrPicture}
          style={styles.camera_action_btn}>
          {isVideo ? (
            toggleVideoIcon ? (
              toggleVideoIcon
            ) : (
              <View style={[styles.flex_centered]}>
                <Text style={styles.txt_white}>Video</Text>
              </View>
            )
          ) : togglePictureIcon ? (
            togglePictureIcon
          ) : (
            <View style={[styles.flex_centered]}>
              <Text style={styles.txt_white}>Picture</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const stylesWithProps = (height, width) => {
  const is_vertical = height > width;

  return StyleSheet.create({
    flex_centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    txt_white: {
      color: '#FFF',
    },
    camera_action_btn: {
      height: 60,
      width: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
