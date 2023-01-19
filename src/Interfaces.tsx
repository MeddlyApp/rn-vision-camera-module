import {PhotoFile} from 'react-native-vision-camera';

// ********** Config & Controls ********** //

export interface CameraState {
  isVideo: boolean;
  frontCamera: boolean;
  flash?: string;
  isRecording?: boolean;
  videoStabilizationMode?: string;
  preset?: string;
  hideStatusBar?: boolean;
}

export interface CameraConfig {
  photo: boolean;
  video: boolean;
  fps?: number;
  nameConvention?: string;
}

export interface SectionHeights {
  top: number;
  bottom: number;
}

// ********** Custom Components ********** //

export interface CameraCustomSection {
  component?: any;
  showWhileRecording?: boolean;
}

export interface ViewportIcons {
  frontCamera?: any;
  backCamera?: any;
}

export interface FlashIcons {
  flashOn?: any;
  flashAuto?: any;
  flashOff?: any;
}

export interface CameraIcons {
  takePictureIcon?: any;
  startRecordingIcon?: any;
  stopRecordingIcon?: any;
  togglePictureIcon?: any;
  toggleVideoIcon?: any;
  viewportIcon?: ViewportIcons;
  flashIcons?: FlashIcons;
  cameraSecondary?: CameraCustomSection;
}

export interface CustomComponents {
  cameraTop?: CameraCustomSection;
  cameraMiddle?: CameraCustomSection;
  cameraBottom?: CameraCustomSection;
  icons?: CameraIcons;
}

// ********** Media Response Payloads ********** //

export interface PhotoPlayload extends PhotoFile {
  orientation: string;
  height: number;
  width: number;
}

export interface VideoPayload {
  data: string;
  duration: number;
  timestamp_start: number;
  timestamp_end: number;
  orientation: string;
  height: number;
  width: number;
}
