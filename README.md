# Overview

- **Camera Library:** React Native Vision Camera
- **Features:**

  - Image & Video Capture
  - Gesture Controls
    - Pinch to Zoom
    - Tap to focus
    - Double tap to switch viewport
  - Portrait / Landscape UI for right and left handed individuals
  - Flash
  - Component Props
    ```javascript
    <PlethoraCamera
      upload={{
        uploadUrl: '',
        authToken: null, // Can be: `${token} || null
        nameConvention: null, // Can be: `${name}` || null
      }}
      saveToCameraRoll={true}
      // Lifecycle Triggers
      onRecordingFinished={p => console.log('RECORDING_FINISHED', p)}
      onRecordingError={e => console.log('RECORDING_ERROR', e)}
      onTakePicture={p => console.log('PICTURE', p)}
      onUploadComplete={u => console.log('UPLOADED', u)}
      onUploadProgress={p => console.log('UPLOADING...', p)}
      onUploadError={e => console.log('UPLOAD_ERROR', e)}
    />
    ```

**NOTE:::** React Native Vision Camera requires Reanimated
