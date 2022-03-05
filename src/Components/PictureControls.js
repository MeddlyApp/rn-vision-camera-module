import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from '../styles';

export default function PictureControls(props) {
  return (
    <TouchableOpacity onPress={props.takePicture} style={styles.rec_btn}>
      <Text style={styles.txt_white}>Snap</Text>
    </TouchableOpacity>
  );
}
