import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';

export default function VideoControls(props) {
  const {state, icons} = props;
  const {front_camera, is_recording} = state;
  const {cameraSecondary, viewPortIcon, togglePictureIcon, toggleVideoIcon} =
    icons;

  const cameraView = front_camera ? 'Front' : 'Back';

  return (
    <>
      <View style={styles.camera_action}>
        {cameraSecondary ? cameraSecondary : null}
      </View>

      <View style={styles.camera_action}>
        {!is_recording ? (
          <TouchableOpacity
            onPress={props.startVideo}
            style={
              !icons.startRecordingIcon
                ? styles.rec_btn
                : styles.camera_action_btn
            }>
            {icons.startRecordingIcon ? (
              icons.startRecordingIcon
            ) : (
              <Text style={styles.txt_white}>Record</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={props.endVideo}
            style={
              !icons.stopRecordingIcon
                ? styles.stop_btn
                : styles.camera_action_btn
            }>
            {icons.stopRecordingIcon ? (
              icons.stopRecordingIcon
            ) : (
              <Text style={styles.txt_white}>Stop</Text>
            )}
          </TouchableOpacity>
        )}
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
