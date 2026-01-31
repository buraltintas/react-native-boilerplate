/**
 * Shared - Hooks - useRewardedAd
 * 
 * Hook for showing rewarded ads
 */

import {useEffect, useState} from 'react';
import {adsService, RewardedAdResult} from '@infra/ads';

export function useRewardedAd() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if ad is ready
    const checkReady = () => {
      setIsReady(adsService.isRewardedReady());
    };

    checkReady();
    const interval = setInterval(checkReady, 1000);

    return () => clearInterval(interval);
  }, []);

  const showAd = async (): Promise<RewardedAdResult | null> => {
    return adsService.showRewardedAd();
  };

  return {
    isReady,
    showAd,
  };
}

export default useRewardedAd;
