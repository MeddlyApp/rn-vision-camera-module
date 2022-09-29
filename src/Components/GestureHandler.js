import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

export default function GestureHandler(props) {
  const {
    showTakePicIndicator,
    onSingleTap,
    onDoubleTap,
    onPinchStart,
    onPinchEnd,
    onPinchProgress,
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
    children,
  } = props;

  const pinchRef = useRef();
  const doubleTapRef = useRef();

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

    const swipingLeft = this.touchX - event.pageX > distance;
    const swipingRight = this.touchX - event.pageX < -distance;
    const swipingUp = this.touchY - event.pageY > distance;
    const swipingDown = this.touchY - event.pageY < -distance;

    if (swipingLeft) return onSwipeLeft ? onSwipeLeft(event) : null;
    if (swipingRight) return onSwipeRight ? onSwipeRight(event) : null;
    if (swipingUp) return onSwipeUp ? onSwipeUp(event) : null;
    if (swipingDown) return onSwipeDown ? onSwipeDown(event) : null;
  };

  const msDelay = 175;

  return (
    <GestureHandlerRootView>
      <PinchGestureHandler
        ref={pinchRef}
        onGestureEvent={onGesturePinch}
        onHandlerStateChange={onPinchHandlerStateChange}
        maxDelayMs={msDelay}>
        <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
          <TapGestureHandler
            ref={doubleTapRef}
            onActivated={({nativeEvent}) => onDoubleTap(nativeEvent)}
            waitFor={pinchRef}
            numberOfTaps={2}
            maxDelayMs={msDelay}>
            <View
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={
                showTakePicIndicator
                  ? styles.take_pic_indicator
                  : styles.main_view
              }>
              {children}
            </View>
          </TapGestureHandler>
        </TapGestureHandler>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  main_view: {
    borderColor: '#000',
    borderWidth: 2,
    height: '100%',
    width: '100%',
  },

  take_pic_indicator: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 2,
    height: '100%',
    width: '100%',
  },
});
