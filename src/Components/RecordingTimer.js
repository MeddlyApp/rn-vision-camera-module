import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import formatElapsedTime from '../../utilities/FormatElapsedTime';

export default function RecordingTimer(props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width);

  return (
    <View style={styles.countdown_container}>
      <Text style={styles.time_txt}>{formatElapsedTime(seconds)}</Text>
    </View>
  );
}

const stylesWithProps = (height, width) => {
  const is_vertical = height > width;

  return StyleSheet.create({
    countdown_container: {
      width: is_vertical ? width : 60,
      height: is_vertical ? 60 : height,
      alignItems: 'center',
      justifyContent: 'center',
    },

    time_txt: {
      fontSize: 16,
      color: '#FFF',
    },
  });
};
