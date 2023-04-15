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
  icons?: CameraIcons;
  cameraState: CameraState;
  startVideo: () => void;
  endVideo: () => void;
  isRecording: boolean;
}

export default function VideoControls(props: Props) {
  const {icons, startVideo, endVideo, isRecording} = props;

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width);

  const startRecordingIcon = icons?.startRecordingIcon
    ? icons.startRecordingIcon
    : null;
  const stopRecordingIcon = icons?.stopRecordingIcon
    ? icons.stopRecordingIcon
    : null;

  return (
    <>
      <View style={styles.w33}>
        {/* !isRecording || cameraTop?.showWhileRecording
          ? cameraTop && cameraTop?.component
            ? cameraTop.component
            : null
          : null */}
      </View>

      <View style={styles.w33}>
        {!isRecording ? (
          <TouchableOpacity
            onPress={startVideo}
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
            onPress={endVideo}
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

      <View style={styles.w33}>
        {/* !isRecording || cameraTop?.showWhileRecording
          ? cameraTop && cameraTop?.component
            ? cameraTop.component
            : null
          : null */}
      </View>
    </>
  );
}

const stylesWithProps = (height: number, width: number) => {
  const is_vertical: boolean = height > width;

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

    txt_white: {color: '#FFF'},

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
