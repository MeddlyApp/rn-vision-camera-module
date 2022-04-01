import React from 'react';
import {Text} from 'react-native';
import PlethoraCamera from './PlethoraCamera';

export default function App(props) {
  return (
    <PlethoraCamera
      upload={{
        uploadUrl: ``,
        authToken: null,
        nameConvention: 'Plethora',
      }}
      saveToCameraRoll={true}
      // Lifecycle Events
      onRecordingFinished={payload => {
        return await UploadHTTP.uploadVideo(payload, null);
      }}
      onRecordingError={e => console.log('RECORDING_ERROR', e)}
      onTakePicture={p => console.log('PICTURE', p)}
      onUploadComplete={u => console.log('UPLOADED', u)}
      onUploadProgress={p => console.log(`UPLOADING... ${p}%`)}
      onUploadError={e => console.log('UPLOAD_ERROR', e)}
      // Custom Icons
      icons={{
        takePictureIcon: <Text style={{color: '#00FF00'}}>Snap</Text>,
        startRecordingIcon: <Text style={{color: '#00FF00'}}>Record</Text>,
        stopRecordingIcon: <Text style={{color: '#00FFFF'}}>Stop</Text>,
        togglePictureIcon: <Text style={{color: '#FF00AA'}}>Picture</Text>,
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
      }}>
      <Text style={{color: '#FFF'}}>child</Text>
    </PlethoraCamera>
  );
}