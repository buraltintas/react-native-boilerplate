/**
 * Native - QR Scanner
 * 
 * Abstraction layer for QR/barcode scanning
 * Uses Expo BarCodeScanner
 */

import {BarCodeScanner, BarCodeEvent} from 'expo-barcode-scanner';
import {requestBarcodeScannerPermission} from '../permissions';

export {BarCodeScanner};
export type {BarCodeEvent};

/**
 * Check and request barcode scanner permission
 */
export async function ensureScannerPermission(): Promise<boolean> {
  const result = await requestBarcodeScannerPermission();
  return result.status === 'granted';
}

/**
 * QR Scanner service
 */
export const qrScannerService = {
  /**
   * Prepare scanner (request permissions)
   */
  prepare: async (): Promise<boolean> => {
    return ensureScannerPermission();
  },

  /**
   * Parse scanned data
   */
  parseQRData: (data: string): any => {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  },
};
