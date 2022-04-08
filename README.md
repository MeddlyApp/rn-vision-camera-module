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
- Custom icons, custom top bar, custom middle section, and custom bottom bar
- Component Example (includes all props)
- Camera settings: control state and hook into component

  - Flash:
  - Viewport:
  - Video / Photo Mode:

```javascript
// import Camera from '@plethora_co/rn-vision-camera';

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

const children = {
  cameraTop: <Text style={{color: '#FFF'}}>Top</Text>,
  cameraMiddle: <Text style={{color: '#FFF'}}>Middle</Text>,
  cameraBottom: <Text style={{color: '#FFF'}}>Bottom</Text>,
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

// Render
<PlethoraCamera
  // Camera Config
  cameraConfig={cameraConfig}
  cameraState={cameraState}
  stateActions={stateActions}
  // Pre-Built Actions
  upload={uploadConfig}
  saveToCameraRoll={true}
  // Lifecycle Events
  onRecordingStart={r => console.log('onRecordingStart', r)}
  onRecordingFinished={r => console.log('onRecordingFinished', r)}
  onRecordingError={e => console.log('onRecordingError', e)}
  onTakePicture={p => console.log('onTakePicture', p)}
  onUploadComplete={u => console.log('onUploadComplete', u)}
  onUploadProgress={p => console.log(`onUploadProgress... ${p}%`)}
  onUploadError={e => console.log('onUploadError', e)}
  onOrientationChange={o => console.log('onOrientationChange', o)}
  // Custom Icons
  icons={iconsConfig}>
  {children}
</PlethoraCamera>;
```

# Roadmap

- Add: Write Geolocation data to file metadata
- Add: Ability to get device camera info
