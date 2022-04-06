import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';

export default function VideoControls(props) {
  const {is_recording, icons} = props;

  if (!is_recording) {
    return (
      <TouchableOpacity
        onPress={props.startVideo}
        style={!icons.startRecordingIcon ? styles.rec_btn : styles.camera_btn}>
        {icons.startRecordingIcon ? (
          icons.startRecordingIcon
        ) : (
          <Text style={styles.txt_white}>Record</Text>
        )}
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={props.endVideo}
        style={!icons.stopRecordingIcon ? styles.stop_btn : styles.camera_btn}>
        {icons.stopRecordingIcon ? (
          icons.stopRecordingIcon
        ) : (
          <Text style={styles.txt_white}>Stop</Text>
        )}
      </TouchableOpacity>
    );
  }
}
