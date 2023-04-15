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
  };

  const cameraState: CameraState = {
    isVideo,
    frontCamera,
    flash,
    isRecording,
    videoStabilizationMode,
    preset,
    hideStatusBar,
  };

  const config: CameraConfig = {
    photo: true, // Required
    video: true, // Required
    fps: 25,
    nameConvention: `Plethora`,
  };

  const whiteText = {color: '#FFF'};
  const customComponents: CustomComponents = {
    // Main Sections
    cameraTop: {
      component: <Text style={whiteText}>Top</Text>,
      showWhileRecording: false,
    },
    cameraMiddle: {
      component: <Text style={whiteText}>Middle</Text>,
      showWhileRecording: false,
    },
    cameraAboveControls: {
      component: <Text style={whiteText}>Above Camera</Text>,
      showWhileRecording: false,
    },
    cameraBottom: {
      component: <Text style={whiteText}>Bottom</Text>,
      showWhileRecording: false,
    },

    // Camera Controls Section
    cameraControlsLeft: {
      component: <Text style={whiteText}>Left</Text>,
      showWhileRecording: false,
    },
    cameraControlsRight: {
      component: <Text style={whiteText}>Right</Text>,
      showWhileRecording: false,
    },

    // Camera Control Icons
    icons: {
      // Base Camera Controls
      // takePictureIcon: <Text style={{color: '#FFFF00'}}>SNP</Text>,
      // startRecordingIcon: <Text style={{color: '#00FF00'}}>REC</Text>,
      // stopRecordingIcon: <Text style={{color: '#00FFFF'}}>STP</Text>,
      // Additional Recording Controls
      // cameraSecondary: {
      //  component: <Text style={{color: '#FFAAFF'}}>SEC</Text>,
      //  showWhileRecording: true,
      // },
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
