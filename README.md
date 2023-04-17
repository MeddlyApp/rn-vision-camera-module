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
- Custom icons, custom top bar, custom middle section, left / right of record / snap icons, and custom bottom bar
- Component Example (includes all props)
- Camera settings: control state and hook into component
  - Flash
  - Viewport
  - Video / Photo Mode

```typescript
import Camera from '@plethora_co/rn-vision-camera';

const [isVideo, setIsVideo] = useState<boolean>(true);
const [frontCamera, setFrontCamera] = useState<boolean>(false);
const [flash, setFlash] = useState<string>('auto');
const [videoStabilizationMode, setVideoStabilizationMode] =
  useState<VideoStabilizationMode>('auto');
const [preset, setPreset] = useState<CameraPreset>('high');
const [hideStatusBar, setHideStatusBar] = useState<boolean>(false);
const [isRecording, setIsRecording] = useState<boolean>(false);
const [zoomValue, setZoomValue] = useState<number>(0);

/*/
 * startRecording: 
 *  - can be async
 *  - must return true to start recording
 * stopRecording: 
 *  - can be async
 *  - must return true to stop recording
/*/

const stateActions = {
  startRecording: () => {
    setIsRecording(true);
    return true;
  },
  stopRecording: () => {
    setIsRecording(false);
    return true;
  },
  getDeviceInfo: (x: CameraDevice) => console.log('Device Info: ', x),
  setZoomValue: (x: number) => setZoomValue(x),
};

const cameraState = {
  isVideo,
  frontCamera,
  flash,
  isRecording,
  videoStabilizationMode,
  preset,
  zoomValue,
  hideStatusBar,
};

const cameraConfig = {
  photo: true, // Required
  video: true, // Required
  nameConvention: 'Plethora',
};

const customComponents = {
  // Main Sections
  cameraTop: {
    component: <Text>Top</Text>,
  },
  cameraMiddle: {
    component: <Text>Middle</Text>,
  },
  cameraAboveControls: {
    component: <Text>Above Camera</Text>,
  },
  cameraBottom: {
    component: <Text>Bottom</Text>,
  },

  // Camera Controls Section
  cameraControlsLeft: {
    component: <Text>Left</Text>,
  },
  cameraControlsPrimary: {
    component: <Text>{isVideo ? 'Video' : 'Photo'}</Text>,
  },
  cameraControlsRight: {
    component: <Text>Right</Text>,
  },

  // Alternatively, you don't want to add custom logic to ,
  // cameraControlsPrimary you can use the built-in camera
  // controls and just add custom icons
  // Note: if you use both, cameraControlsPrimary will take precedence

  // Camera Control Icons
  icons: {
    takePictureIcon: <Text>SNP</Text>,
    startRecordingIcon: <Text>REC</Text>,
    stopRecordingIcon: <Text>STP</Text>,
  },
};

const sectionHeights = {
  top: 100,
  bottom: 100,
};

// Render
<PlethoraCamera
  // Camera Config
  config={config}
  cameraState={cameraState}
  stateActions={stateActions}
  sectionHeights={sectionHeights}
  // Pre-Built Actions
  showCameraControls={true}
  saveToCameraRoll={true}
  // Lifecycle Events
  onTakePicture={res => console.log('onTakePicture', res)}
  onRecordingStart={res => console.log('onRecordingStart', res)}
  onRecordingFinished={res => console.log('onRecordingFinished', res)}
  onRecordingError={e => console.log('onRecordingError', e)}
  onOrientationChange={val => console.log('onOrientationChange', val)}
  // Custom Gesture Controls
  onDoubleTap={res => console.log('onDoubleTap', res)}
  swipeDistance={200}
  onSwipeLeft={res => console.log('onSwipeLeft', res)}
  onSwipeRight={res => console.log('onSwipeRight', res)}
  onSwipeUp={res => console.log('onSwipeUp', res)}
  onSwipeDown={res => console.log('onSwipeDown', res)}>
  {customComponents}
</PlethoraCamera>;
```

# Bugs

- For whatever reason, `format` in `RenderCamera.js` isn't working properly
  - function returns the proper camera
  - photos are only 1088 x 1088 px instead of 1728 x 3648 px like selected

# Roadmap

- Add: Write Geolocation data to file metadata
- Add: Ability to get device camera info
