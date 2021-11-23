import React from 'react';
import {StyleSheet} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

export default function VisionCamera(props) {
  let {camera} = props;
  let device = useCameraDevices();

  let getCameraPermissions = () => {
    Camera.getCameraPermissionStatus().then(async res => {
      if (res === 'not-determined') await Camera.requestCameraPermission();
    });
  };
  getCameraPermissions();

  let getMicrophonePermissions = () => {
    Camera.getMicrophonePermissionStatus().then(async res => {
      if (res === 'not-determined') await Camera.requestMicrophonePermission();
    });
  };
  getMicrophonePermissions();

  return (
    <Camera
      ref={camera}
      device={device}
      isActive={true}
      style={StyleSheet.absoluteFill}
      fps={240}
    />
  );
}
