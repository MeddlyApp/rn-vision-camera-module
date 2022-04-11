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

  const onGesturePinch = ({e}) => onPinchProgress(e.scale);
  const onPinchHandlerStateChange = e => {
    const pinch_end = e.nativeEvent.state === State.END;
    const pinch_begin = e.nativeEvent.oldState === State.BEGAN;
    const pinch_active = e.nativeEvent.state === State.ACTIVE;
    if (pinch_end) onPinchEnd();
    else if (pinch_begin && pinch_active) onPinchStart();
  };

  // Swipe Gestures
  onTouchStart = e => {
    this.touchY = e.nativeEvent.pageY;
    this.touchX = e.nativeEvent.pageX;
  };
  onTouchEnd = e => {
    const event = e.nativeEvent;
    const distance = props.swipeDistance ? props.swipeDistance : 200;

    // Vetical - Up
    if (this.touchY - event.pageY > distance) {
      // console.log('Swiped: Up');
      return onSwipeUp ? onSwipeUp(event) : null;
    }
    // Vetical - Down
    if (this.touchY - event.pageY < -distance) {
      // console.log('Swiped: Down');
      return onSwipeDown ? onSwipeDown(e.nativeEvent) : null;
    }

    // Horizontal - Left
    if (this.touchX - event.pageX > distance) {
      // console.log('Swiped: Left');
      return onSwipeLeft ? onSwipeLeft(event) : null;
    }
    // Horizontal - Right
    if (this.touchX - event.pageX < -distance) {
      // console.log('Swiped: Right');
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
            onActivated={e => onDoubleTap(e.nativeEvent)}
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
