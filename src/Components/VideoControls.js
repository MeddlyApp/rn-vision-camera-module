import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';

export default function VideoControls(props) {
  const {is_recording, icons} = props;

  if (!is_recording) {
    return (
      <TouchableOpacity onPress={props.startVideo}>
        {icons.startRecordingIcon ? (
          icons.startRecordingIcon
        ) : (
          <View style={styles.rec_btn}>
            <Text style={styles.txt_white}>Record</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={props.endVideo}>
        {icons.stopRecordingIcon ? (
          icons.stopRecordingIcon
        ) : (
          <View style={styles.stop_btn}>
            <Text style={styles.txt_white}>Stop</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
