import {
  CameraDevice,
  CameraPreset,
  PhotoFile,
  VideoStabilizationMode,
} from 'react-native-vision-camera';

// ********** Config & Controls ********** //

export interface CameraState {
  isVideo: boolean;
  frontCamera: boolean;
  flash?: string;
  isRecording: boolean;
  videoStabilizationMode: VideoStabilizationMode;
  preset: CameraPreset;
  zoomValue: number;
  hideStatusBar?: boolean;
}

export interface CameraConfig {
  photo: boolean;
  video: boolean;
  nameConvention?: string;
}

export interface SectionHeights {
  top: number;
  bottom: number;
}

// ********** Custom Components ********** //

export interface CameraCustomSection {
  component?: JSX.Element;
}

export interface CameraIcons {
  takePictureIcon?: JSX.Element;
  startRecordingIcon?: JSX.Element;
  stopRecordingIcon?: JSX.Element;
}

export interface CustomComponents {
  cameraTop?: CameraCustomSection;
  cameraMiddle?: CameraCustomSection;
  cameraAboveControls?: CameraCustomSection;
  cameraBottom?: CameraCustomSection;
  cameraControlsLeft?: CameraCustomSection;
  cameraControlsRight?: CameraCustomSection;
  icons?: CameraIcons;
}

export interface StateActions {
  startRecording: () => Promise<boolean>;
  stopRecording: () => Promise<boolean>;
  getDeviceInfo: (val: CameraDevice | undefined) => void | undefined;
  setZoomValue: (val: number) => void;
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
