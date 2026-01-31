/**
 * Native - Permissions
 * 
 * Abstraction layer for native permissions
 * Uses Expo permissions APIs
 */

import {Camera} from 'expo-camera';
import {BarCodeScanner} from 'expo-barcode-scanner';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

/**
 * Request camera permission
 */
export async function requestCameraPermission(): Promise<PermissionResult> {
  try {
    const {status, canAskAgain} = await Camera.requestCameraPermissionsAsync();
    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('[Permissions] Error requesting camera permission:', error);
    return {status: 'denied', canAskAgain: false};
  }
}

/**
 * Check camera permission
 */
export async function checkCameraPermission(): Promise<PermissionStatus> {
  try {
    const {status} = await Camera.getCameraPermissionsAsync();
    return status as PermissionStatus;
  } catch (error) {
    console.error('[Permissions] Error checking camera permission:', error);
    return 'denied';
  }
}

/**
 * Request barcode scanner permission (usually same as camera)
 */
export async function requestBarcodeScannerPermission(): Promise<PermissionResult> {
  try {
    const {status, canAskAgain} = await BarCodeScanner.requestPermissionsAsync();
    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('[Permissions] Error requesting barcode scanner permission:', error);
    return {status: 'denied', canAskAgain: false};
  }
}

/**
 * Check barcode scanner permission
 */
export async function checkBarcodeScannerPermission(): Promise<PermissionStatus> {
  try {
    const {status} = await BarCodeScanner.getPermissionsAsync();
    return status as PermissionStatus;
  } catch (error) {
    console.error('[Permissions] Error checking barcode scanner permission:', error);
    return 'denied';
  }
}
