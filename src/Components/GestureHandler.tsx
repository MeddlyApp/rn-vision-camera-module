import React, {useRef} from 'react';
import {
  GestureResponderEvent,
  NativeTouchEvent,
  StyleSheet,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  TapGestureHandler,
  State,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  GestureEvent,
  GestureEventPayload,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';

interface Props {
  onSingleTap?: (val: HandlerStateChangeEvent<Record<string, unknown>>) => void;
  onDoubleTap?: (val: GestureEventPayload) => void;
  onPinchStart: () => void;
  onPinchEnd: () => void;
  onPinchProgress: (val: number) => void;
  onSwipeUp?: (val: NativeTouchEvent) => void;
  onSwipeDown?: (val: NativeTouchEvent) => void;
  onSwipeLeft?: (val: NativeTouchEvent) => void;
  onSwipeRight?: (val: NativeTouchEvent) => void;
  swipeDistance?: number;
  children?: JSX.Element;
}

export default function GestureHandler(props: Props) {
  const {
    onSingleTap,
    onDoubleTap,
    onPinchStart,
    onPinchEnd,
    onPinchProgress,
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
    swipeDistance,
    children,
  } = props;

  const pinchRef = useRef();
  const doubleTapRef = useRef();

  const onGesturePinch = ({nativeEvent}: PinchGestureHandlerGestureEvent) => {
    onPinchProgress(nativeEvent.scale);
  };

  const onPinchHandlerStateChange = ({
    nativeEvent,
  }: PinchGestureHandlerStateChangeEvent) => {
    const pinch_end = nativeEvent.state === State.END;
    const pinch_begin = nativeEvent.oldState === State.BEGAN;
    const pinch_active = nativeEvent.state === State.ACTIVE;
    if (pinch_end) onPinchEnd();
    if (pinch_begin && pinch_active) onPinchStart();
  };

  let touchY = 0;
  let touchX = 0;

  // Swipe Gestures
  const onTouchStart = ({nativeEvent}: GestureResponderEvent) => {
    touchY = nativeEvent.pageY;
    touchX = nativeEvent.pageX;
  };

  const onTouchEnd = ({nativeEvent}: GestureResponderEvent) => {
    const event = nativeEvent;
    const distance = swipeDistance ? swipeDistance : 200;

    const swipingLeft = touchX - event.pageX > distance;
    const swipingRight = touchX - event.pageX < -distance;
    const swipingUp = touchY - event.pageY > distance;
    const swipingDown = touchY - event.pageY < -distance;

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
        onHandlerStateChange={onPinchHandlerStateChange}>
        <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
          <TapGestureHandler
            ref={doubleTapRef}
            onActivated={({nativeEvent}: GestureEvent) => {
              if (onDoubleTap) onDoubleTap(nativeEvent);
            }}
            waitFor={pinchRef}
            numberOfTaps={2}
            maxDelayMs={msDelay}>
            <View
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={styles.main_view}>
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
    height: '100%',
    width: '100%',
  },
});
