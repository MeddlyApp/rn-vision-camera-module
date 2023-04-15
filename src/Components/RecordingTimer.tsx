import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import formatElapsedTime from '../../utilities/FormatElapsedTime';

export default function RecordingTimer() {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(() => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const {height, width} = useWindowDimensions();
  const styles = stylesWithProps(height, width);

  return (
    <View style={styles.countdown_container}>
      <Text style={styles.time_txt}>{formatElapsedTime(seconds)}</Text>
    </View>
  );
}

const stylesWithProps = (height: number, width: number) => {
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
