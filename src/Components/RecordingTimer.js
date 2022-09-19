import React, {useState, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import formatElapsedTime from '../../utilities/FormatElapsedTime';

export default function RecordingTimer(props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <Text style={styles.time}>{formatElapsedTime(seconds)}</Text>;
}

const styles = StyleSheet.create({
  time: {
    fontSize: 16,
    color: '#FFF',
  },
});
