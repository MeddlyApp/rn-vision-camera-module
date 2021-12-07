import React from 'react';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

export default function GestureHandler(props) {
  let {pinchRef, doubleTapRef, onSingleTap, onDoubleTap, children} = props;

  let onGesturePinch = ({nativeEvent}) => {
    props.onPinchProgress(nativeEvent.scale);
  };

  let onPinchHandlerStateChange = event => {
    let pinch_end = event.nativeEvent.state === State.END;
    let pinch_begin = event.nativeEvent.oldState === State.BEGAN;
    let pinch_active = event.nativeEvent.state === State.ACTIVE;
    if (pinch_end) {
      props.onPinchEnd();
    } else if (pinch_begin && pinch_active) {
      props.onPinchStart();
    }
  };

  return (
    <GestureHandlerRootView>
      <PinchGestureHandler
        ref={pinchRef}
        // onActivated={() => console.log('DRAGGGG')}
        // onActivated={onGesturePinch}
        onGestureEvent={onGesturePinch}
        onHandlerStateChange={onPinchHandlerStateChange}
        maxDelayMs={175}>
        <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
          <TapGestureHandler
            ref={doubleTapRef}
            onActivated={onDoubleTap}
            waitFor={pinchRef}
            numberOfTaps={2}
            maxDelayMs={175}>
            {children}
          </TapGestureHandler>
        </TapGestureHandler>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}
