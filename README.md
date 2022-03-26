# Setup

- **Follow setup instructions for the following libraries**
  - [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera)
  - [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
  - [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)
  - [react-native-orientation-locker](https://github.com/wonday/react-native-orientation-locker)
  - [@react-native-community/cameraroll](https://github.com/react-native-cameraroll/react-native-cameraroll)
  - [react-native-fs](https://github.com/itinance/react-native-fs)

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
