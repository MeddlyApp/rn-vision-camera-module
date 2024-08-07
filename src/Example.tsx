import React, {useState, useEffect} from 'react';
import {Alert, NativeTouchEvent, Text, TouchableOpacity} from 'react-native';
import {
  CameraConfig,
  CameraState,
  CustomComponents,
  PhotoPlayload,
  SectionHeights,
  VideoPayload,
  StateActions,
} from './Interfaces';
import MeddlyCamera from './MeddlyCamera';
import {
  CameraCaptureError,
  CameraDeviceFormat,
  VideoStabilizationMode,
} from 'react-native-vision-camera';
import {GestureEventPayload} from 'react-native-gesture-handler';

export default function App() {
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const [frontCamera, setFrontCamera] = useState<boolean>(false);
  const [flash, setFlash] = useState<'on' | 'off'>('off');
  const [videoStabilizationMode, setVideoStabilizationMode] =
    useState<VideoStabilizationMode>('auto');
  const [hideStatusBar, setHideStatusBar] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    if (isRecording && !hideStatusBar) setHideStatusBar(true);
    if (!isRecording && hideStatusBar) setHideStatusBar(false);
  }, [isRecording]);

  const stateActions: StateActions = {
    startRecording: async () => {
      return new Promise(resolve => {
        return Alert.alert(
          'Start',
          "Are you sure you're ready to start recording?",
          [
            {text: 'Cancel', style: 'cancel', onPress: () => resolve(false)},
            {text: 'Start', style: 'default', onPress: () => resolve(true)},
          ],
          {cancelable: false},
        );
      });
    },
    stopRecording: async () => {
      return new Promise(resolve => {
        return Alert.alert(
          'End',
          "Are you sure you're ready to end the recording?",
          [
            {text: 'Cancel', style: 'cancel', onPress: () => resolve(false)},
            {text: 'End', style: 'default', onPress: () => resolve(true)},
          ],
          {cancelable: false},
        );
      });
    },
    getDeviceInfo: (x: CameraDeviceFormat | undefined) => {
      console.log('getDeviceInfo', x);
      return;
    },
  };

  const cameraState: CameraState = {
    isVideo,
    frontCamera,
    flash,
    videoStabilizationMode,
    hideStatusBar,
    startswitch: false,
    killswitch: false,
  };

  const config: CameraConfig = {
    photo: true, // Required
    video: true, // Required
    nameConvention: `Meddly`,
  };

  const whiteText: any = {color: '#FFF'};
  const greenText: any = {color: '#0F0'};
  const redText: any = {color: '#F00'};

  const customComponents: CustomComponents = {
    // Main Sections
    cameraTop: {
      component: <Text style={whiteText}>Top</Text>,
    },
    cameraMiddle: {
      component: <Text style={whiteText}>Middle</Text>,
    },
    cameraAboveControls: {
      component: <Text style={whiteText}>Above Camera</Text>,
    },
    cameraBottom: {
      component: <Text style={whiteText}>Bottom</Text>,
    },

    // Camera Controls Section
    cameraControlsLeft: {
      component: <Text style={whiteText}>Left</Text>,
    },
    cameraControlsPrimary: {
      component: (
        <Text style={whiteText}>
          {isVideo ? (isRecording ? 'Stop' : 'Start') : 'Photo'}
        </Text>
      ),
    },
    cameraControlsRight: {
      component: (
        <TouchableOpacity onPress={() => setFrontCamera(!frontCamera)}>
          <Text style={whiteText}>{frontCamera ? 'Front' : 'Back'}</Text>
        </TouchableOpacity>
      ),
    },

    // Alternatively, you don't want to add custom logic to ,
    // cameraControlsPrimary you can use the built-in camera
    // controls and just add custom icons
    // Note: if you use both, cameraControlsPrimary will take precedence

    icons: {
      takePictureIcon: <Text style={greenText}>Snap</Text>,
      startRecordingIcon: <Text style={greenText}>Record</Text>,
      stopRecordingIcon: <Text style={redText}>Stop</Text>,
    },
  };

  const sectionHeights: SectionHeights = {top: 100, bottom: 100};

  return (
    <MeddlyCamera
      // Camera Config
      config={config}
      isFocused={true} // for react-navigation, use const isFocused = useIsFocused()
      cameraState={cameraState}
      stateActions={stateActions}
      sectionHeights={sectionHeights}
      hideNoDeviceFound={false}
      // Pre-Built Actions
      showCameraControls={true}
      saveToCameraRoll={true}
      useLocation={true}
      forceUseLocation={true}
      // Lifecycle Events
      onIsRecording={(val: boolean) => setIsRecording(val)}
      onTakePicture={(res: PhotoPlayload) => console.log('onTakePicture', res)}
      onRecordingStart={(res: number) => console.log('onRecordingStart', res)}
      onRecordingFinished={(res: VideoPayload) => console.log('finished', res)}
      onRecordingError={(e: CameraCaptureError) =>
        console.log('onRecordingError', e)
      }
      // onOrientationChange={(val: string) => console.log('orientation', val)}
      // Custom Gesture Controls
      onSingleTap={(res: GestureEventPayload) => console.log('singleTap', res)}
      onDoubleTap={(res: GestureEventPayload) => console.log('doubleTap', res)}
      swipeDistance={200}
      onSwipeLeft={(res: NativeTouchEvent) => console.log('onSwipeLeft', res)}
      onSwipeRight={(res: NativeTouchEvent) => console.log('onSwipeRight', res)}
      onSwipeUp={(res: NativeTouchEvent) => console.log('onSwipeUp', res)}
      onSwipeDown={(res: NativeTouchEvent) => console.log('onSwipeDown', res)}>
      {customComponents}
    </MeddlyCamera>
  );
}
