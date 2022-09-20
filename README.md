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
  - [ffmpeg-kit-react-native](https://github.com/tanersener/ffmpeg-kit/tree/main/react-native)

# Overview

**Features:**

- Image & Video Capture
- Gesture Controls
  - Pinch to Zoom
  - Tap to focus
  - Custom Gestures via props
    - onDoubleTap
    - onSwipeLeft
    - onSwipeRight
    - onSwipeUp
    - onSwipeDown
- Portrait / Landscape UI for right and left handed individuals
- Save to camera roll
- Flash
- Custom icons, custom top bar, custom middle section, and custom bottom bar
- Component Example (includes all props)
- Camera settings: control state and hook into component
  - Flash:
  - Viewport:
  - Video / Photo Mode:

```javascript
import Camera from '@plethora_co/rn-vision-camera';

const [isVideo, setIsVideo] = useState(true);
const [frontCamera, setFrontCamera] = useState(false);
const [flash, setFlash] = useState('auto');
const [videoStabilizationMode, setVideoStabilizationMode] = useState('auto');
const [preset, setPreset] = useState('high'); // ['high', 'medium', 'low']
const [isRecording, setIsRecording] = useState(false);

const stateActions = {
  toggleFlash: toggleFlash,
  toggleFrontCamera: () => setFrontCamera(!frontCamera),
  setIsVideo: () => setIsVideo(!isVideo),
  startRecording: () => setIsRecording(true),
  stopRecording: () => setIsRecording(false),
  getDeviceInfo: x => console.log('Device Info: ', x),
};

const cameraState = {
  isVideo,
  frontCamera,
  flash,
  isRecording,
  videoStabilizationMode,
  preset,
};

const cameraConfig = {
  photo: true, // Required
  video: true, // Required
  fps: 60,
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

// Render
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
  onRecordingStart={ts => console.log('onRecordingStart', ts)}
  onRecordingFinished={r => console.log('onRecordingFinished', r)}
  onRecordingError={e => console.log('onRecordingError', e)}
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
</PlethoraCamera>;
```

# Bugs

- For whatever reason, `format` in `RenderCamera.js` isn't working properly
  - function returns the proper camera
  - photos are only 1088 x 1088 px instead of 1728 x 3648 px like selected

# Roadmap

- Add: Write Geolocation data to file metadata
- Add: Ability to get device camera info
