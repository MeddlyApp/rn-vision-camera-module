import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from '../styles';

export default function MissingPermissions(props) {
  const {has_camera_permission, has_microphone_permission} = props;

  return (
    <TouchableOpacity
      onPress={props.openSettings}
      style={styles.permissions_content_container}>
      {!has_camera_permission ? (
        <Text style={styles.txt_white}>Camera Permission Denied</Text>
      ) : null}

      {!has_microphone_permission ? (
        <Text style={styles.txt_white}>Microphone Permission Denied</Text>
      ) : null}

      <Text style={styles.txt_white_margin_top}>Open Settings</Text>
    </TouchableOpacity>
  );
}