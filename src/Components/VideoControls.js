import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

export default function VideoControls(props) {
  const {icons, cameraState, isRecording} = props;
  const {frontCamera} = cameraState;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width);

  const startRecordingIcon = icons ? icons.startRecordingIcon : null;
  const stopRecordingIcon = icons ? icons.stopRecordingIcon : null;
  const cameraSecondary = icons ? icons.cameraSecondary : null;
  const viewportIcon = icons ? icons.viewportIcon : null;

  const is_vertical = height > width;
  const vertical_styles = {
    ...styles.flex_centered,
    height: 120,
    minWidth: width / 3,
    maxWidth: width / 3,
  };
  const horizontal_styles = {
    ...styles.flex_centered,
    flex: 1,
    width: 120,
    minHeight: height / 3,
    maxHeight: height / 3,
  };

  const cameraView = frontCamera ? 'Front' : 'Back';

  return (
    <>
      <View style={is_vertical ? vertical_styles : horizontal_styles}>
        {/* cameraSecondary.showWhileRecording */}
        {!isRecording || cameraSecondary.showWhileRecording
          ? cameraSecondary && cameraSecondary.component
            ? cameraSecondary.component
            : null
          : null}
      </View>

      <View style={is_vertical ? vertical_styles : horizontal_styles}>
        {!isRecording ? (
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
        {!isRecording ? (
          cameraView === 'Front' ? (
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
          )
        ) : null}
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

    rec_btn: {
      height: 90,
      width: 90,
      borderColor: '#FFFFFF',
      borderWidth: 3,
      borderRadius: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },

    stop_btn: {
      height: 90,
      width: 90,
      borderColor: '#FF0000',
      borderWidth: 3,
      borderRadius: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
