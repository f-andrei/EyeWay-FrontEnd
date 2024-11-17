import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (isWeb) {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return { dimensions, isWeb };
};