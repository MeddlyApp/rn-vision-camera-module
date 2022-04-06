import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';

export default function PictureControls(props) {
  const {state, icons} = props;
  const {front_camera} = state;
  const {
    takePictureIcon,
    cameraSecondary,
    viewPortIcon,
    togglePictureIcon,
    toggleVideoIcon,
  } = icons;

  const cameraView = front_camera ? 'Front' : 'Back';

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
            {viewPortIcon && viewPortIcon.frontCamera ? (
              viewPortIcon.frontCamera
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
            {viewPortIcon && viewPortIcon.backCamera ? (
              viewPortIcon.backCamera
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
