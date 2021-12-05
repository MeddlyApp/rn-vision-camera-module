import React from 'react';
import {View} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import styles from './styles';

export default function GestureHandler(props) {
  let {is_vertical, doubleTapRef, onSingleTap, onDoubleTap, children} = props;

  return (
    <GestureHandlerRootView>
      <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
        <TapGestureHandler
          ref={doubleTapRef}
          onActivated={onDoubleTap}
          numberOfTaps={2}
          maxDelayMs={175}>
          <View
            style={
              is_vertical
                ? styles.vertical_camera_container
                : styles.horizontal_camera_container
            }>
            {children}
          </View>
        </TapGestureHandler>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
}
