import React from 'react';
import Config from '../config/devConfig';
import PlethoraCamera from './PlethoraCamera';
// import UploadHTTP from '../utilities/http/UploadHTTP';

export default function App(props) {
  return (
    <PlethoraCamera
      upload={{
        uploadUrl: Config.API_URL,
        authToken: null,
        nameConvention: 'Plethora',
      }}
      saveToCameraRoll={true}
      //
      // Lifecycle Events
      // onRecordingFinished={payload => { return await UploadHTTP.uploadVideo(payload, null) }}
      // onRecordingError={e => console.log('RECORDING_ERROR', e)}
      // onTakePicture={p => console.log('PICTURE', p)}
      // onUploadComplete={u => console.log('UPLOADED', u)}
      // onUploadProgress={p => console.log(`UPLOADING... ${p}%`)}
      // onUploadError={e => console.log('UPLOAD_ERROR', e)}
    />
  );
}
