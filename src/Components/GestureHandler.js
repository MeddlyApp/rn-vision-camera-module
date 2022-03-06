import React, {Component} from 'react';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

export default function GestureHandler(props) {
  const {onSingleTap, onDoubleTap, children} = props;

  const onGesturePinch = ({nativeEvent}) => {
    props.onPinchProgress(nativeEvent.scale);
  };

  const onPinchHandlerStateChange = event => {
    const pinch_end = event.nativeEvent.state === State.END;
    const pinch_begin = event.nativeEvent.oldState === State.BEGAN;
    const pinch_active = event.nativeEvent.state === State.ACTIVE;
    if (pinch_end) {
      props.onPinchEnd();
    } else if (pinch_begin && pinch_active) {
      props.onPinchStart();
    }
  };

  return (
    <GestureHandlerRootView>
      <PinchGestureHandler
        ref={props.pinchRef}
        onGestureEvent={onGesturePinch}
        onHandlerStateChange={onPinchHandlerStateChange}
        maxDelayMs={175}>
        <TapGestureHandler
          waitFor={props.doubleTapRef}
          onActivated={onSingleTap}>
          <TapGestureHandler
            ref={props.doubleTapRef}
            onActivated={onDoubleTap}
            waitFor={props.pinchRef}
            numberOfTaps={2}
            maxDelayMs={175}>
            {children}
          </TapGestureHandler>
        </TapGestureHandler>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}
