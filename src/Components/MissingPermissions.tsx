import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

interface Props {
  hasCameraPermission: boolean;
  hasMicrophonePermission: boolean;
  hasCameraRollPermission: boolean;
  openSettings: () => void;
}

export default function MissingPermissions(props: Props) {
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

      <Text style={[styles.txt_white, styles.mt30]}>Open Settings</Text>
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

  mt30: {marginTop: 30},
});
