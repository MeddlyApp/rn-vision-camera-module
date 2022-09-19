import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from '../styles';

export default function MissingPermissions(props) {
  const {
    hasCameraPermission,
    hasMicrophonePermission,
    hasCameraRollPermission,
  } = props;

  return (
    <TouchableOpacity
      onPress={props.openSettings}
      style={styles.permissions_content_container}>
      {!hasCameraPermission ? (
        <Text style={styles.txt_white}>Camera Permission Denied</Text>
      ) : null}

      {!hasMicrophonePermission ? (
        <Text style={styles.txt_white}>Microphone Permission Denied</Text>
      ) : null}

      {!hasCameraRollPermission ? (
        <Text style={styles.txt_white}>Camera Roll Permission Denied</Text>
      ) : null}

      <Text style={styles.txt_white_margin_top}>Open Settings</Text>
    </TouchableOpacity>
  );
}
