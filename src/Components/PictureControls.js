import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';

export default function PictureControls(props) {
  const {takePictureIcon} = props.icons;

  return (
    <TouchableOpacity
      onPress={props.takePicture}
      style={!takePictureIcon ? styles.snap_btn : null}>
      {takePictureIcon ? (
        takePictureIcon
      ) : (
        <Text style={styles.txt_white}>Snap</Text>
      )}
    </TouchableOpacity>
  );
}
