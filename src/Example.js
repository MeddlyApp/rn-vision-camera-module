import React from 'react';
import {Text, View} from 'react-native';
import PlethoraCamera from './PlethoraCamera';

export default function App() {
  /*/ Config takes all arguments from Vision Camera
   *  https://mrousavy.com/react-native-vision-camera/docs/api/interfaces/CameraProps
   * 
   *    Config Requires...
   *    - photo: boolean
   *    - video: boolean
   *    - audio: boolean
  /*/

  const children = {
    cameraTop: <Text style={{color: '#FFF'}}>Top</Text>,
    cameraMiddle: <Text style={{color: '#FFF'}}>Middle</Text>,
    cameraBottom: <Text style={{color: '#FFF'}}>Bottom</Text>,
  };

  return (
    <PlethoraCamera
      // Camera Config
      camConfig={{
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
      }}
      // Pre-Built Actions
      upload={{
        uploadUrl: ``,
        authToken: null,
        nameConvention: 'Plethora',
      }}
      saveToCameraRoll={true}
      // Lifecycle Events
      onRecordingFinished={p => console.log('onRecordingFinishedCallback', p)}
      onRecordingError={e => console.log('RECORDING_ERROR', e)}
      onTakePicture={p => console.log('PICTURE', p)}
      onUploadComplete={u => console.log('UPLOADED', u)}
      onUploadProgress={p => console.log(`UPLOADING... ${p}%`)}
      onUploadError={e => console.log('UPLOAD_ERROR', e)}
      // Custom Icons
      icons={{
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
      }}>
      {children}
    </PlethoraCamera>
  );
}
