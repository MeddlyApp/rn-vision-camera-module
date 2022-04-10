import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';

export default function PictureControls(props) {
  const {icons, cameraState} = props;
  const {frontCamera} = cameraState;

  let takePictureIcon,
    cameraSecondary,
    viewportIcon = null;
  if (icons) {
    takePictureIcon = icons.takePictureIcon;
    cameraSecondary = icons.cameraSecondary;
    viewportIcon = icons.viewportIcon;
  }

  const cameraView = frontCamera ? 'Front' : 'Back';

  return (
    <>
      <View style={styles.camera_action}>
        {cameraSecondary ? cameraSecondary : <View />}
      </View>

      <View style={styles.camera_action}>
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

      <View style={styles.camera_action}>
        {cameraView === 'Front' ? (
          <TouchableOpacity
            onPress={props.toggleCamera}
            style={styles.camera_action_btn}>
            {viewportIcon && viewportIcon.frontCamera ? (
              viewportIcon.frontCamera
            ) : (
              <View>
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
              <View>
                <Text style={styles.txt_white}>Back</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
