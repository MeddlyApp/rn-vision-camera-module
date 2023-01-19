import React, {useState} from 'react';
import {Alert, Text} from 'react-native';
import {
  CameraConfig,
  CameraState,
  CustomComponents,
  PhotoPlayload,
  SectionHeights,
  VideoPayload,
} from './Interfaces';
import PlethoraCamera from './PlethoraCamera';

export default function App() {
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const [frontCamera, setFrontCamera] = useState<boolean>(false);
  const [flash, setFlash] = useState<string>('auto');
  const [videoStabilizationMode, setVideoStabilizationMode] =
    useState<string>('auto');
  const [preset, setPreset] = useState<string>(['high', 'medium', 'low'][0]);
  const [hideStatusBar, setHideStatusBar] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const toggleFlash = () => {
    switch (flash) {
      case 'off':
        return setFlash('on');
      case 'on':
        return setFlash('auto');
      case 'auto':
        return setFlash('off');
      default:
        return setFlash('off');
    }
  };

  const toggleVideoStabilizationMode = () => {
    switch (videoStabilizationMode) {
      case 'off':
        return setVideoStabilizationMode('on');
      case 'on':
        return setVideoStabilizationMode('auto');
      case 'auto':
        return setVideoStabilizationMode('off');
      default:
        return setVideoStabilizationMode('off');
    }
  };

  const toggleCameraQualityPreset = () => {
    switch (preset) {
      case 'low':
        return setPreset('medium');
      case 'medium':
        return setPreset('high');
      case 'high':
        return setPreset('low');
      default:
        return setPreset('high');
    }
  };

  const stateActions = {
    toggleFlash: toggleFlash,
    toggleFrontCamera: () => setFrontCamera(!frontCamera),
    setIsVideo: () => setIsVideo(!isVideo),
    startRecording: async () => {
      return new Promise(resolve => {
        return Alert.alert(
          `Start`,
          `Are you sure you're ready to start recording?`,
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
          `End`,
          `Are you sure you're ready to end the recording?`,
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
    getDeviceInfo: (x: any) => console.log('Device Info: ', x),
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

  const customComponents: CustomComponents = {
    cameraTop: {
      component: <Text style={{color: '#FFF'}}>Top</Text>,
      showWhileRecording: false,
    },
    cameraMiddle: {
      component: <Text style={{color: '#FFF'}}>Middle</Text>,
      showWhileRecording: false,
    },
    cameraBottom: {
      component: <Text style={{color: '#FFF'}}>Bottom</Text>,
      showWhileRecording: false,
    },
    icons: {
      // Base Camera Controls
      takePictureIcon: <Text style={{color: '#FFFF00'}}>SNP</Text>,
      startRecordingIcon: <Text style={{color: '#00FF00'}}>REC</Text>,
      stopRecordingIcon: <Text style={{color: '#00FFFF'}}>STP</Text>,
      // Built In Setting Controls
      togglePictureIcon: <Text style={{color: '#00AAFF'}}>Picture</Text>,
      toggleVideoIcon: <Text style={{color: '#FFAAFF'}}>Video</Text>,
      viewportIcon: {
        frontCamera: <Text style={{color: '#00FF00'}}>Front</Text>,
        backCamera: <Text style={{color: '#00FFFF'}}>Back</Text>,
      },
      flashIcons: {
        flashOn: <Text style={{color: '#FFFF00'}}>On</Text>,
        flashAuto: <Text style={{color: '#00FFFF'}}>Auto</Text>,
        flashOff: <Text style={{color: '#00FF00'}}>Off</Text>,
      },
      // Additional Recording Controls
      cameraSecondary: {
        component: <Text style={{color: '#FFAAFF'}}>SEC</Text>,
        showWhileRecording: true,
      },
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
      onRecordingError={(e: any) => console.log('onRecordingError', e)}
      onOrientationChange={(val: string) =>
        console.log('onOrientationChange', val)
      }
      // Custom Gesture Controls
      onDoubleTap={(res: any) => console.log('onDoubleTap', res)}
      swipeDistance={200}
      onSwipeLeft={(res: any) => console.log('onSwipeLeft', res)}
      onSwipeRight={(res: any) => console.log('onSwipeRight', res)}
      onSwipeUp={(res: any) => console.log('onSwipeUp', res)}
      onSwipeDown={(res: any) => console.log('onSwipeDown', res)}>
      {customComponents}
    </PlethoraCamera>
  );
}
