/**
 * Shared - Hooks - useFeatureFlag
 * 
 * Hook for accessing feature flags
 */

import {useState, useEffect} from 'react';
import {featureFlagsService, FEATURE_FLAGS} from '@infra/feature-flags';

type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const [isEnabled, setIsEnabled] = useState(() =>
    featureFlagsService.isEnabled(key),
  );

  useEffect(() => {
    // Update if flags change (e.g., after remote fetch)
    const checkFlag = () => {
      const enabled = featureFlagsService.isEnabled(key);
      setIsEnabled(enabled);
    };

    // Check immediately
    checkFlag();

    // Check periodically (optional)
    const interval = setInterval(checkFlag, 5000);

    return () => clearInterval(interval);
  }, [key]);

  return isEnabled;
}

export default useFeatureFlag;
