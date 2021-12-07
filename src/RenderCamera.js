import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import styles from './styles';

export default function RenderCamera(props) {
  let {camera, camera_active, front_camera, is_video, zoom} = props;

  let devices = useCameraDevices();
  let device = front_camera ? devices.front : devices.back;

  // NOTE: zoom state is multiplied by 10 because 1 is minimum

  if (device == null) {
    return (
      <View style={styles.no_device_container}>
        <Text style={styles.txt_white}>No Device Found</Text>
      </View>
    );
  } else {
    return (
      <Camera
        ref={camera}
        device={device}
        isActive={camera_active}
        video={is_video}
        audio={is_video}
        fps={240}
        zoom={zoom * 10}
        autoFocusSystem={'contrast-detection'}
        videoStabilizationMode={'cinematic-extended'}
        // enableZoomGesture={true}
        minZoom={device.minZoom}
        maxZoom={device.maxZoom}
        style={StyleSheet.absoluteFill}
      />
    );
  }
}

/*/
 * Camera Props
 * - photo: boolean
 * - video: boolean
 * - audio: boolean
 * - photoHeight: number
 * - photoWidth: number
 * - enableHighQualityPhotos: boolean
 * - enableZoomGesture: boolean
 * - videoHeight: number
 * - videoWidth: number
 * - fps: number
 * - hdr: boolean
 * - lowLightBoost: boolean
 * - isHighestPhotoQualitySupported: boolean
 * - maxISO: number
 * - minISO: number
 * - fieldOfView: number
 * - minZoom: number
 * - maxZoom: number
 * - colorSpace: 
       ios: ['hlg-bt2020', 'p3-d65', 'srgb'
       android: ['yuv', 'jpeg', 'jpeg-depth', 'raw', 'heic', 'private', 'depth-16', 'unknown']
 * - supportsVideoHDR: boolean
 * - supportsPhotoHDR: boolean
 * - frameRateRanges: {
       minFrameRate: number;        
       maxFrameRate: number;
     }
 * - autoFocusSystem: ['contrast-detection', 'phase-detection', 'none']
 * - videoStabilizationMode: ['off', 'standard', 'cinematic', 'cinematic-extended', 'auto']
/*/
