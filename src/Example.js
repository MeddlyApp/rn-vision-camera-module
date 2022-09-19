import React, {useState} from 'react';
import {Text} from 'react-native';
import PlethoraCamera from './PlethoraCamera';

export default function App() {
  const [isVideo, setIsVideo] = useState(true);
  const [frontCamera, setFrontCamera] = useState(false);
  const [flash, setFlash] = useState('auto');

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

  const [isRecording, setIsRecording] = useState(false); // New
  const cameraState = {isVideo, frontCamera, flash, isRecording}; // New cameraState.isRecording

  const stateActions = {
    toggleFlash: toggleFlash,
    toggleFrontCamera: () => setFrontCamera(!frontCamera),
    setIsVideo: () => setIsVideo(!isVideo),
    startRecording: () => setIsRecording(true), // New
    stopRecording: () => setIsRecording(false), // New
  };

  /*/ Config takes all arguments from Vision Camera
   *  https://mrousavy.com/react-native-vision-camera/docs/api/interfaces/CameraProps
   * 
   *    Config Requires...
   *    - photo: boolean
   *    - video: boolean
   *    - audio: boolean
  /*/

  const config = {
    photo: true, // Required
    video: true, // Required
    audio: true, // Required
    // Optional
    enableHighQualityPhotos: true,
    lowLightBoost: true,
    autoFocusSystem: 'contrast-detection',
    videoStabilizationMode: 'cinematic-extended',
    // hdr: true,
    // supportsVideoHDR: true,
    // supportsPhotoHDR: true,
    fps: 30,
    // Name
    nameConvention: `Plethora`,
  };

  const custom = {
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

  return (
    <PlethoraCamera
      // Camera Config
      config={config}
      cameraState={cameraState}
      stateActions={stateActions}
      // Pre-Built Actions
      showCameraControls={true}
      saveToCameraRoll={true}
      // Lifecycle Events
      onTakePicture={p => console.log('onTakePicture', p)}
      onRecordingStart={ts => {
        console.log('onRecordingStart', ts);
        setIsRecording(true);
      }}
      onRecordingFinished={r => {
        console.log('onRecordingFinished', r);
        setIsRecording(false);
      }}
      onRecordingError={e => {
        console.log('onRecordingError', e);
        setIsRecording(false);
      }}
      onOrientationChange={o => console.log('onOrientationChange', o)}
      // Custom Gesture Controls
      onTapFocus={t => console.log('onTapFocus', t)}
      onDoubleTap={t => console.log('onDoubleTap', t)}
      swipeDistance={200}
      onSwipeLeft={t => console.log('onSwipeLeft', t)}
      onSwipeRight={t => console.log('onSwipeRight', t)}
      onSwipeUp={t => console.log('onSwipeUp', t)}
      onSwipeDown={t => console.log('onSwipeDown', t)}>
      {custom}
    </PlethoraCamera>
  );
}
