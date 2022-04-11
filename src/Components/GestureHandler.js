import React from 'react';
import {View} from 'react-native';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import styles from '../styles';

export default function GestureHandler(props) {
  const {
    showTakePicIndicator,
    pinchRef,
    doubleTapRef,
    onSingleTap,
    onDoubleTap,
    onPinchStart,
    onPinchProgress,
    onPinchEnd,
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
    // Other
    children,
  } = props;

  const onGesturePinch = ({nativeEvent}) => {
    onPinchProgress(nativeEvent.scale);
  };
  const onPinchHandlerStateChange = ({nativeEvent}) => {
    const pinch_end = nativeEvent.state === State.END;
    const pinch_begin = nativeEvent.oldState === State.BEGAN;
    const pinch_active = nativeEvent.state === State.ACTIVE;
    if (pinch_end) onPinchEnd();
    if (pinch_begin && pinch_active) onPinchStart();
  };

  // Swipe Gestures
  onTouchStart = ({nativeEvent}) => {
    this.touchY = nativeEvent.pageY;
    this.touchX = nativeEvent.pageX;
  };
  onTouchEnd = ({nativeEvent}) => {
    const event = nativeEvent;
    const distance = props.swipeDistance ? props.swipeDistance : 200;

    // Vetical - Up
    if (this.touchY - event.pageY > distance) {
      return onSwipeUp ? onSwipeUp(event) : null;
    }
    // Vetical - Down
    if (this.touchY - event.pageY < -distance) {
      return onSwipeDown ? onSwipeDown(event) : null;
    }

    // Horizontal - Left
    if (this.touchX - event.pageX > distance) {
      return onSwipeLeft ? onSwipeLeft(event) : null;
    }
    // Horizontal - Right
    if (this.touchX - event.pageX < -distance) {
      return onSwipeRight ? onSwipeRight(event) : null;
    }
  };

  return (
    <GestureHandlerRootView>
      <PinchGestureHandler
        ref={pinchRef}
        onGestureEvent={onGesturePinch}
        onHandlerStateChange={onPinchHandlerStateChange}
        maxDelayMs={175}>
        <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
          <TapGestureHandler
            ref={doubleTapRef}
            onActivated={({nativeEvent}) => onDoubleTap(nativeEvent)}
            waitFor={pinchRef}
            numberOfTaps={2}
            maxDelayMs={175}>
            <View
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={showTakePicIndicator ? styles.take_pic_indicator : null}>
              {children}
            </View>
          </TapGestureHandler>
        </TapGestureHandler>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}
