import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

export default function PictureControls(props) {
  const {icons, cameraState, isRecording} = props;
  const {frontCamera} = cameraState;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width);

  const takePictureIcon = icons ? icons.takePictureIcon : null;
  const cameraSecondary = icons ? icons.cameraSecondary : null;
  const viewportIcon = icons ? icons.viewportIcon : null;

  const cameraView = frontCamera ? 'Front' : 'Back';

  return (
    <>
      <View>
        {!isRecording || cameraSecondary.showWhileRecording
          ? cameraSecondary && cameraSecondary.component
            ? cameraSecondary.component
            : null
          : null}
      </View>

      <View>
        <TouchableOpacity
          onPress={props.takePicture}
          style={!takePictureIcon ? styles.snap_btn : styles.camera_action_btn}>
          {takePictureIcon ? (
            takePictureIcon
          ) : (
            <Text style={styles.txt_white}>Snap</Text>
          )}
        </TouchableOpacity>
      </View>

      <View>
        {cameraView === 'Front' ? (
          <TouchableOpacity
            onPress={props.toggleCamera}
            style={styles.camera_action_btn}>
            {viewportIcon && viewportIcon.frontCamera ? (
              viewportIcon.frontCamera
            ) : (
              <View style={[styles.flex_centered]}>
                <Text style={styles.txt_white}>Front</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={props.toggleCamera}
            style={styles.camera_action_btn}>
            {viewportIcon && viewportIcon.backCamera ? (
              viewportIcon.backCamera
            ) : (
              <View style={[styles.flex_centered]}>
                <Text style={styles.txt_white}>Back</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
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

    snap_btn: {
      height: 90,
      width: 90,
      borderColor: '#FFFFFF',
      borderWidth: 3,
      borderRadius: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
