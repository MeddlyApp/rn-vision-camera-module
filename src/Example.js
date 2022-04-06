import React, {useState} from 'react';
import {Text} from 'react-native';
import PlethoraCamera from './PlethoraCamera';

export default function App() {
  const [isVideo, setIsVideo] = useState(!false);
  const [frontCamera, setFrontCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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

  const cameraState = {isVideo, frontCamera, isRecording, flash};
  const stateActions = {
    toggleFlash: toggleFlash,
    toggleFrontCamera: () => setFrontCamera(!frontCamera),
    setIsVideo: () => setIsVideo(!isVideo),
    setIsRecording: v => setIsRecording(v),
  };

  const children = {
    cameraTop: <Text style={{color: '#FFF'}}>Top</Text>,
    cameraMiddle: <Text style={{color: '#FFF'}}>Middle</Text>,
    cameraBottom: <Text style={{color: '#FFF'}}>Bottom</Text>,
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
    // fps: 240,
  };

  const uploadConfig = {
    uploadUrl: ``,
    authToken: null,
    nameConvention: 'Plethora',
  };

  const iconsConfig = {
    // Base Camera Controls
    takePictureIcon: <Text style={{color: '#FFFF00'}}>SNP</Text>,
    startRecordingIcon: <Text style={{color: '#00FF00'}}>REC</Text>,
    stopRecordingIcon: <Text style={{color: '#00FFFF'}}>STP</Text>,
    // Built In Setting Controls
    togglePictureIcon: <Text style={{color: '#00AAFF'}}>Picture</Text>,
    toggleVideoIcon: <Text style={{color: '#FFAAFF'}}>Video</Text>,
    viewPortIcon: {
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
      onRecordingFinished={p => console.log('onRecordingFinishedCallback', p)}
      onRecordingError={e => console.log('RECORDING_ERROR', e)}
      onTakePicture={p => console.log('PICTURE', p)}
      onUploadComplete={u => console.log('UPLOADED', u)}
      onUploadProgress={p => console.log(`UPLOADING... ${p}%`)}
      onUploadError={e => console.log('UPLOAD_ERROR', e)}
      // Custom Icons
      icons={iconsConfig}>
      {children}
    </PlethoraCamera>
  );
}
