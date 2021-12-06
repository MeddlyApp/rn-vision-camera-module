import React from 'react';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';

export default function GestureHandler(props) {
  let {pinchRef, doubleTapRef, onSingleTap, onDoubleTap, children} = props;

  return (
    <GestureHandlerRootView>
      <PinchGestureHandler
        ref={pinchRef}
        onActivated={() => console.log('DRAGGGG')}
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
