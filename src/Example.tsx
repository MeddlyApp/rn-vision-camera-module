import React, {useState} from 'react';
import {Alert, NativeTouchEvent, Text} from 'react-native';
import {
  CameraConfig,
  CameraState,
  CustomComponents,
  PhotoPlayload,
  SectionHeights,
  VideoPayload,
  StateActions,
} from './Interfaces';
import PlethoraCamera from './PlethoraCamera';
import {
  CameraDevice,
  CameraPreset,
  CaptureError,
  VideoStabilizationMode,
} from 'react-native-vision-camera';
import {GestureEventPayload} from 'react-native-gesture-handler';

export default function App() {
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const [frontCamera, setFrontCamera] = useState<boolean>(false);
  const [flash, setFlash] = useState<string>('auto');
  const [videoStabilizationMode, setVideoStabilizationMode] =
    useState<VideoStabilizationMode>('auto');
  const [preset, setPreset] = useState<CameraPreset>('high');
  const [hideStatusBar, setHideStatusBar] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [zoomValue, setZoomValue] = useState<number>(0);

  const stateActions: StateActions = {
    startRecording: async () => {
      return new Promise(resolve => {
        return Alert.alert(
          'Start',
          "Are you sure you're ready to start recording?",
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Start',
              style: 'default',
              onPress: () => {
                setIsRecording(true);
                return resolve(true);
              },
            },
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
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'End',
              style: 'default',
              onPress: () => {
                setIsRecording(false);
                return resolve(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
    },
    getDeviceInfo: (x: CameraDevice | undefined) => {
      console.log('Device Info: ', x);
    },
    setZoomValue: (x: number) => setZoomValue(x),
  };

  const cameraState: CameraState = {
    isVideo,
    frontCamera,
    flash,
    isRecording,
    videoStabilizationMode,
    preset,
    zoomValue,
    hideStatusBar,
  };

  const config: CameraConfig = {
    photo: true, // Required
    video: true, // Required
    nameConvention: `Plethora`,
  };

  const whiteText = {color: '#FFF'};
  const greenText = {color: '#0F0'};
  const redText = {color: '#F00'};

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
    cameraControlsRight: {
      component: <Text style={whiteText}>Right</Text>,
    },

    // Camera Control Icons
    icons: {
      takePictureIcon: <Text style={greenText}>SNP</Text>,
      startRecordingIcon: <Text style={greenText}>REC</Text>,
      stopRecordingIcon: <Text style={redText}>STP</Text>,
    },
  };

  const sectionHeights: SectionHeights = {
    top: 100,
    bottom: 100,
  };

  return (
    <PlethoraCamera
      // Camera Config
      config={config}
      cameraState={cameraState}
      stateActions={stateActions}
      sectionHeights={sectionHeights}
      // Pre-Built Actions
      showCameraControls={true}
      saveToCameraRoll={true}
      // Lifecycle Events
      onTakePicture={(res: PhotoPlayload) => console.log('onTakePicture', res)}
      onRecordingStart={(res: number) => console.log('onRecordingStart', res)}
      onRecordingFinished={(res: VideoPayload) =>
        console.log('onRecordingFinished', res)
      }
      onRecordingError={(e: CaptureError) => console.log('onRecordingError', e)}
      onOrientationChange={(val: string) =>
        console.log('onOrientationChange', val)
      }
      // Custom Gesture Controls
      onDoubleTap={(res: GestureEventPayload) =>
        console.log('onDoubleTap', res)
      }
      swipeDistance={200}
      onSwipeLeft={(res: NativeTouchEvent) => console.log('onSwipeLeft', res)}
      onSwipeRight={(res: NativeTouchEvent) => console.log('onSwipeRight', res)}
      onSwipeUp={(res: NativeTouchEvent) => console.log('onSwipeUp', res)}
      onSwipeDown={(res: NativeTouchEvent) => console.log('onSwipeDown', res)}>
      {customComponents}
    </PlethoraCamera>
  );
}
