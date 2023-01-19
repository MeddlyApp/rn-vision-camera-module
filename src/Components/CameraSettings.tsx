import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

interface Props {
  frontCamera: boolean;
  flash?: string;
  isVideo: boolean;
  toggleFlash?: () => any;
  toggleVideoOrPicture?: () => any;
  toggleCamera: () => any;
  icons?: any;
}

export default function CameraSettings(props: Props) {
  const {
    frontCamera,
    flash,
    isVideo,
    toggleFlash,
    toggleVideoOrPicture,
    toggleCamera,
    icons,
  } = props;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width);

  const flashIcons = icons ? icons.flashIcons : null;
  const togglePictureIcon = icons ? icons.togglePictureIcon : null;
  const toggleVideoIcon = icons ? icons.toggleVideoIcon : null;

  const cameraView = frontCamera ? 'Front' : 'Back';

  return (
    <>
      {/* Flash */}
      <View style={styles.w50}>
        {cameraView === 'Front' ? null : (
          <TouchableOpacity
            onPress={toggleFlash}
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
      <View style={styles.w50}>
        <TouchableOpacity
          onPress={toggleVideoOrPicture}
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

const stylesWithProps = (height: number, width: number) => {
  const is_vertical = height > width;

  return StyleSheet.create({
    w50: {
      height: is_vertical ? 60 : height / 2,
      width: is_vertical ? width / 2 : 60,
      alignItems: 'center',
      justifyContent: 'center',
    },

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
