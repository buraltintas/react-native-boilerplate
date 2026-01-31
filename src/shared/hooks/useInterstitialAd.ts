/**
 * Shared - Hooks - useInterstitialAd
 * 
 * Hook for showing interstitial ads
 */

import {useEffect, useState} from 'react';
import {adsService} from '@infra/ads';

export function useInterstitialAd() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if ad is ready
    const checkReady = () => {
      setIsReady(adsService.isInterstitialReady());
    };

    checkReady();
    const interval = setInterval(checkReady, 1000);

    return () => clearInterval(interval);
  }, []);

  const showAd = async () => {
    return adsService.showInterstitialAd();
  };

  return {
    isReady,
    showAd,
  };
}

export default useInterstitialAd;
