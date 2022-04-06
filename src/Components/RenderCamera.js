import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import styles from '../styles';

export default function RenderCamera(props) {
  const {camera, config, camera_active, frontCamera, zoom} = props;
  const devices = useCameraDevices();
  const device = frontCamera ? devices.front : devices.back;

  // NOTE: zoom state is multiplied by 10 because 1 is minimum

  const {
    photo,
    video,
    audio,
    fps,
    enableHighQualityPhotos,
    lowLightBoost,
    videoStabilizationMode,
    autoFocusSystem,
  } = config;

  const hghqlphto = enableHighQualityPhotos ? enableHighQualityPhotos : null;
  const lwLghtBst = lowLightBoost ? lowLightBoost : false;
  const vidStblMd = videoStabilizationMode ? videoStabilizationMode : null;
  const autoFcsSys = autoFocusSystem ? autoFocusSystem : null;
  const framesPerSec = fps ? fps : null;

  if (device == null) {
    return (
      <View style={styles.no_device_container}>
        <Text style={styles.txt_white}>No Device Found</Text>
      </View>
    );
  } else {
    return (
      <Camera
        // Root
        ref={camera}
        device={device}
        isActive={camera_active}
        // Custom Config - Required
        photo={photo}
        video={video}
        audio={audio}
        // Custom Config - Optional
        enableHighQualityPhotos={hghqlphto}
        lowLightBoost={lwLghtBst}
        autoFocusSystem={autoFcsSys}
        videoStabilizationMode={vidStblMd}
        fps={framesPerSec}
        // Lib Decisions
        zoom={zoom * 10}
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
 * - enableHighQualityPhotos: boolean
 * - lowLightBoost: boolean
 * - autoFocusSystem: ['contrast-detection', 'phase-detection', 'none']
 * - videoStabilizationMode: ['off', 'standard', 'cinematic', 'cinematic-extended', 'auto']
 * - fps: number
 * - hdr: boolean
 * - supportsVideoHDR: boolean
 * - supportsPhotoHDR: boolean
 * 
 * - photoHeight: number
 * - photoWidth: number
 * - enableZoomGesture: boolean
 * - videoHeight: number
 * - videoWidth: number
 * - isHighestPhotoQualitySupported: boolean
 * - maxISO: number
 * - minISO: number
 * - fieldOfView: number
 * - minZoom: number
 * - maxZoom: number
 * - colorSpace: 
       ios: ['hlg-bt2020', 'p3-d65', 'srgb'
       android: ['yuv', 'jpeg', 'jpeg-depth', 'raw', 'heic', 'private', 'depth-16', 'unknown']
 * - frameRateRanges: {
       minFrameRate: number;        
       maxFrameRate: number;
     }
/*/
