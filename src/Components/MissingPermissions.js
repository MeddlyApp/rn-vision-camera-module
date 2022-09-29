import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default function MissingPermissions(props) {
  const {
    hasCameraPermission,
    hasMicrophonePermission,
    hasCameraRollPermission,
    openSettings,
  } = props;

  return (
    <TouchableOpacity onPress={openSettings} style={styles.flex_centered}>
      {!hasCameraPermission ? (
        <Text style={styles.txt_white}>Camera Permission Denied</Text>
      ) : null}

      {!hasMicrophonePermission ? (
        <Text style={styles.txt_white}>Microphone Permission Denied</Text>
      ) : null}

      {!hasCameraRollPermission ? (
        <Text style={styles.txt_white}>Camera Roll Permission Denied</Text>
      ) : null}

      <Text style={[styles.txt_white, styles.margin_top]}>Open Settings</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex_centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txt_white: {
    fontWeight: '700',
    color: '#FFFFFF',
  },

  margin_top: {
    marginTop: 30,
  },
});
