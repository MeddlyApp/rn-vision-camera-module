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

  const cameraState = {isVideo, frontCamera, flash};
  const stateActions = {
    toggleFlash: toggleFlash,
    toggleFrontCamera: () => setFrontCamera(!frontCamera),
    setIsVideo: () => setIsVideo(!isVideo),
  };

  /*/ Config takes all arguments from Vision Camera
   *  https://mrousavy.com/react-native-vision-camera/docs/api/interfaces/CameraProps
   * 
   *    Config Requires...
   *    - photo: boolean
   *    - video: boolean
   *    - audio: boolean
  /*/

  const cameraConfig = {
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
    fps: 60,
  };

  const authToken = '';
  const uploadConfig = {
    uploadUrl: ``,
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json',
    },
    nameConvention: 'Plethora',
  };

  const custom = {
    cameraTop: <Text style={{color: '#FFF'}}>Top</Text>,
    cameraMiddle: <Text style={{color: '#FFF'}}>Middle</Text>,
    cameraBottom: <Text style={{color: '#FFF'}}>Bottom</Text>,
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
      cameraSecondary: <Text style={{color: '#FFAAFF'}}>SEC</Text>,
    },
  };

  return (
    <PlethoraCamera
      // Camera Config
      cameraConfig={cameraConfig}
      cameraState={cameraState}
      stateActions={stateActions}
      // Pre-Built Actions
      upload={uploadConfig}
      saveToCameraRoll={true}
      // Lifecycle Events
      // onTakePicture={p => console.log('onTakePicture', p)}
      // onRecordingStart={() => console.log('onRecordingStart')}
      // onRecordingFinished={r => console.log('onRecordingFinished', r)}
      // onRecordingError={e => console.log('onRecordingError', e)}
      // onUploadComplete={u => console.log('onUploadComplete', u)}
      // onUploadProgress={p => console.log(`onUploadProgress... ${p}%`)}
      // onUploadError={e => console.log('onUploadError', e)}
      // onOrientationChange={o => console.log('onOrientationChange', o)}
      // Custom Gesture Controls
      // onTapFocus={t => console.log('onTapFocus', t)}
      // onDoubleTap={t => console.log('onDoubleTap', t)}
      // swipeDistance={200}
      // onSwipeLeft={t => console.log('onSwipeLeft', t)}
      // onSwipeRight={t => console.log('onSwipeRight', t)}
      // onSwipeUp={t => console.log('onSwipeUp', t)}
      // onSwipeDown={t => console.log('onSwipeDown', t)}
    >
      {custom}
    </PlethoraCamera>
  );
}
