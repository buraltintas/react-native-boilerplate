/**
 * Native - Camera
 * 
 * Abstraction layer for camera functionality
 * Uses Expo Camera
 */

import {Camera, CameraType} from 'expo-camera';
import {requestCameraPermission} from '../permissions';

export {Camera, CameraType};

/**
 * Check and request camera permission
 */
export async function ensureCameraPermission(): Promise<boolean> {
  const result = await requestCameraPermission();
  return result.status === 'granted';
}

/**
 * Camera service abstraction
 * Add custom camera functionality here
 */
export const cameraService = {
  /**
   * Prepare camera (request permissions)
   */
  prepare: async (): Promise<boolean> => {
    return ensureCameraPermission();
  },

  /**
   * Take picture
   * Implement this when needed with Camera ref
   */
  takePicture: async (cameraRef: any) => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      return photo;
    }
    throw new Error('Camera ref not available');
  },
};
