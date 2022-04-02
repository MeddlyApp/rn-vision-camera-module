# Setup

- **Follow setup instructions for the following libraries**
  - [axios](https://github.com/axios/axios)
  - [fbjs](https://github.com/facebook/fbjs)
    - [@react-native-community/cameraroll](https://github.com/react-native-cameraroll/react-native-cameraroll)
  - [react-native-fs](https://github.com/itinance/react-native-fs)
  - [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)
  - [react-native-orientation-locker](https://github.com/wonday/react-native-orientation-locker)
  - [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
  - [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera)

# Overview

**Features:**

- Image & Video Capture
- Gesture Controls
  - Pinch to Zoom
  - Tap to focus
  - Double tap to switch viewport
- Portrait / Landscape UI for right and left handed individuals
- Save to camera roll
- Upload media to API
- Flash
- Component Example (includes all props)

  ```javascript
  // import Camera from '@plethora_co/rn-vision-camera';

  const children = {
    cameraTop: <Text style={{color: '#FFF'}}>Top</Text>,
    cameraMiddle: <Text style={{color: '#FFF'}}>Middle</Text>,
  };

  // Render
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
    {children}
  </PlethoraCamera>;
  ```

  # Roadmap

  - Add ability to get device camera info
  - Add ability for users to set their camera props for quality, fps, etc
