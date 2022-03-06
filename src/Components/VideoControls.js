import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from '../styles';

export default function VideoControls(props) {
  const {is_recording} = props;

  if (!is_recording) {
    return (
      <TouchableOpacity onPress={props.startVideo} style={styles.rec_btn}>
        <Text style={styles.txt_white}>Record</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={props.endVideo} style={styles.stop_btn}>
        <Text style={styles.txt_white}>Stop</Text>
      </TouchableOpacity>
    );
  }
}
