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
import Camera from '@meddly/rn-vision-camera';

const [isVideo, setIsVideo] = useState<boolean>(true);
const [frontCamera, setFrontCamera] = useState<boolean>(false);
const [flash, setFlash] = useState<string>('auto');
const [videoStabilizationMode, setVideoStabilizationMode] =
  useState<VideoStabilizationMode>('auto');
const [preset, setPreset] = useState<CameraPreset>('high');
const [hideStatusBar, setHideStatusBar] = useState<boolean>(false);
const [isRecording, setIsRecording] = useState<boolean>(false);

/*/
 * startRecording:
 *  - can be async
 *  - must return true to start recording
 * stopRecording:
 *  - can be async
 *  - must return true to stop recording
/*/

const stateActions = {
  startRecording: () => true,
  stopRecording: () => true,
  getDeviceInfo: (x: CameraDevice) => console.log('Device Info: ', x)
};

const cameraState = {
  isVideo,
  frontCamera,
  flash,
  isRecording,
  videoStabilizationMode,
  preset,
  hideStatusBar,
  killswitch: false, // Only needed for overrides
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
    component: (
      <Text>{isVideo ? (isRecording ? 'Stop' : 'Start') : 'Photo'}</Text>
    ),
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
<MeddlyCamera
  // Camera Config
  config={config}
  isFocused={true}
  useLocation={true}
  forceUseLocation={false}
  cameraState={cameraState}
  stateActions={stateActions}
  sectionHeights={sectionHeights}
  hideNoDeviceFound={true}
  // Pre-Built Actions
  showCameraControls={true}
  saveToCameraRoll={true}
  // Lifecycle Events
  onIsRecording={val => setIsRecording(val)}
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
</MeddlyCamera>
;
```

# Notes

- Currently running react-native-vison-camera version `2.16.5`
  - To get started..
    1. Go go: ./node_modules/react-native-vison-camera/android/build.gradle"
    2. Line 138 - Change: `minSdkVersion 21` to: `minSdkVersion getExtOrIntegerDefault('minSdkVersion')`
  - To upgrade to version `3.0.0`, permissions values `authorized` must be changed to `granted` in the following files
    - `./src/components/RenderCamera.tsx`
    - `./src/MeddlyCamera.tsx`
  - FPS stuff has been commented out in `2.16.1`. Uncomment FPS in `./src/components/RenderCamera.tsx` if running react-native-vison-camera version `3.0.0`

# Roadmap

- Add: Write Geolocation data to file metadata
