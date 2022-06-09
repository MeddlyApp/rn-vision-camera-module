import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';

export default function VideoControls(props) {
  const {icons, cameraState, is_recording, screenSize} = props;
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

  const is_vertical = screenSize.height > screenSize.width;
  const vertical_styles = {
    ...styles.camera_action,
    height: 120,
    minWidth: screenSize.width / 3,
    maxWidth: screenSize.width / 3,
  };
  const horizontal_styles = {
    ...styles.camera_action,
    flex: 1,
    width: 120,
    minHeight: screenSize.height / 3,
    maxHeight: screenSize.height / 3,
  };

  const cameraView = frontCamera ? 'Front' : 'Back';

  return (
    <>
      <View style={is_vertical ? vertical_styles : horizontal_styles}>
        {/* cameraSecondary.showWhileRecording */}
        {!is_recording || cameraSecondary.showWhileRecording ? (
          <>
            {cameraSecondary && cameraSecondary.component
              ? cameraSecondary.component
              : null}
          </>
        ) : null}
      </View>

      <View style={is_vertical ? vertical_styles : horizontal_styles}>
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

      <View style={is_vertical ? vertical_styles : horizontal_styles}>
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
