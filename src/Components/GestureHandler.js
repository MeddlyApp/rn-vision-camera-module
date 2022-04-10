/*/ 
 * Eventual Upgrade? 
 * https://github.com/software-mansion/react-native-gesture-handler/blob/main/example/src/new_api/camera/index.tsx
/*/

import React from 'react';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  TapGestureHandler,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';

export default function GestureHandler(props) {
  const {
    pinchRef,
    doubleTapRef,
    swipeRef,
    // Action
    onSingleTap,
    onDoubleTap,
    onPinchStart,
    onPinchProgress,
    onPinchEnd,
    onPanStart,
    onPanProgress,
    onPanEnd,
    // Other
    panDistance,
    children,
  } = props;

  const onGesturePinch = ({nativeEvent}) => {
    onPinchProgress(nativeEvent.scale);
  };

  const onPinchHandlerStateChange = event => {
    const pinch_end = event.nativeEvent.state === State.END;
    const pinch_begin = event.nativeEvent.oldState === State.BEGAN;
    const pinch_active = event.nativeEvent.state === State.ACTIVE;
    if (pinch_end) onPinchEnd();
    else if (pinch_begin && pinch_active) onPinchStart();
  };

  const onGesturePan = ({nativeEvent}) => {
    onPanProgress(nativeEvent);
  };
  const onPanStateChange = event => {
    const pan_end = event.nativeEvent.state === State.END;
    const pan_begin = event.nativeEvent.oldState === State.BEGAN;
    const pan_active = event.nativeEvent.state === State.ACTIVE;

    if (pan_end) onPanEnd();
    else if (pan_begin && pan_active) onPanStart();
  };

  return (
    <GestureHandlerRootView>
      <PanGestureHandler
        ref={swipeRef}
        onGestureEvent={onGesturePan}
        onHandlerStateChange={onPanStateChange}
        minDist={panDistance ? panDistance : 50}>
        <PinchGestureHandler
          ref={pinchRef}
          onGestureEvent={onGesturePinch}
          onHandlerStateChange={onPinchHandlerStateChange}
          maxDelayMs={175}>
          <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
            <TapGestureHandler
              ref={doubleTapRef}
              onActivated={e => onDoubleTap(e.nativeEvent)}
              waitFor={pinchRef}
              numberOfTaps={2}
              maxDelayMs={175}>
              {children}
            </TapGestureHandler>
          </TapGestureHandler>
        </PinchGestureHandler>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
