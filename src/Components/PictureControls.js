import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';

export default function PictureControls(props) {
  const {icons} = props;

  return (
    <TouchableOpacity onPress={props.takePicture}>
      {icons.takePictureIcon ? (
        icons.takePictureIcon
      ) : (
        <View style={styles.stop_btn}>
          <Text style={styles.txt_white}>Snap</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
