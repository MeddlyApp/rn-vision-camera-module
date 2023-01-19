import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {CameraIcons, CameraState} from '../Interfaces';

interface Props {
  icons: CameraIcons;
  cameraState: CameraState;
  isRecording?: boolean;
  takePicture: () => any;
  toggleCamera: () => any;
}

export default function PictureControls(props: Props) {
  const {icons, cameraState, isRecording, takePicture, toggleCamera} = props;
  const {frontCamera} = cameraState;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width);

  const takePictureIcon = icons ? icons.takePictureIcon : null;
  const cameraSecondary = icons ? icons.cameraSecondary : null;
  const viewportIcon = icons ? icons.viewportIcon : null;

  const cameraView = frontCamera ? 'Front' : 'Back';

  return (
    <>
      <View style={styles.w33}>
        {!isRecording || cameraSecondary?.showWhileRecording
          ? cameraSecondary && cameraSecondary.component
            ? cameraSecondary.component
            : null
          : null}
      </View>

      <View style={styles.w33}>
        <TouchableOpacity
          onPress={takePicture}
          style={!takePictureIcon ? styles.snap_btn : styles.camera_action_btn}>
          {takePictureIcon ? (
            takePictureIcon
          ) : (
            <Text style={styles.txt_white}>Snap</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.w33}>
        {cameraView === 'Front' ? (
          <TouchableOpacity
            onPress={toggleCamera}
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
            onPress={toggleCamera}
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

const stylesWithProps = (height: number, width: number) => {
  const is_vertical = height > width;

  return StyleSheet.create({
    flex_centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    w33: {
      height: is_vertical ? 120 : height / 3,
      width: is_vertical ? width / 3 : 120,
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
