import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';

export default function VideoControls(props) {
  const {icons, cameraState, is_recording} = props;
  const {frontCamera} = cameraState;

  let startRecordingIcon,
    stopRecordingIcon,
    cameraSecondary,
    viewportIcon = null;
  if (icons) {
    startRecordingIcon = icons.startRecordingIcon;
    stopRecordingIcon = icons.stopRecordingIcon;
    cameraSecondary = icons.cameraSecondary;
    viewportIcon = icons.viewportIcon;
  }

  const cameraView = frontCamera ? 'Front' : 'Back';

  return (
    <>
      <View style={styles.camera_action}>
        {!is_recording ? <>{cameraSecondary ? cameraSecondary : null}</> : null}
      </View>

      <View style={styles.camera_action}>
        {!is_recording ? (
          <TouchableOpacity
            onPress={props.startVideo}
            style={
              !startRecordingIcon ? styles.rec_btn : styles.camera_action_btn
            }>
            {startRecordingIcon ? (
              startRecordingIcon
            ) : (
              <Text style={styles.txt_white}>Record</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={props.endVideo}
            style={
              !stopRecordingIcon ? styles.stop_btn : styles.camera_action_btn
            }>
            {stopRecordingIcon ? (
              stopRecordingIcon
            ) : (
              <Text style={styles.txt_white}>Stop</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.camera_action}>
        {!is_recording ? (
          <>
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
          </>
        ) : null}
      </View>
    </>
  );
}
